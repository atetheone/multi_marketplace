import { test } from '@japa/runner'
import User from '#user/models/user'
import Tenant from '#tenant/models/tenant'
import Product from '#product/models/product'
import Category from '#product/models/category'
import Cart from '#cart/models/cart'
import CartItem from '#cart/models/cart_item'
import Inventory from '#product/models/inventory'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

const CART_ROUTE = '/api/v1/cart'

test.group('Cart API', (group) => {
  let testUser: User
  let testTenant: Tenant
  let testCategory: Category
  let testProduct1: Product
  let testProduct2: Product
  let authToken: string

  group.setup(async () => {
    // Create test tenant
    testTenant = await Tenant.create({
      name: 'Test Cart Store',
      slug: 'test-cart-store',
      domain: 'cart.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test user
    const hashedPassword = await hash.make('password123')
    testUser = await User.create({
      username: 'carttest',
      email: 'carttest@example.com',
      password: hashedPassword,
      firstName: 'Cart',
      lastName: 'Tester',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test category
    testCategory = await Category.create({
      name: 'Cart Test Category',
      slug: 'cart-test-category',
      tenantId: testTenant.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test products
    testProduct1 = await Product.create({
      name: 'Test Product 1',
      description: 'First test product',
      price: 25.00,
      sku: 'CART-TEST-001',
      categoryId: testCategory.id,
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    testProduct2 = await Product.create({
      name: 'Test Product 2',
      description: 'Second test product',
      price: 50.00,
      sku: 'CART-TEST-002',
      categoryId: testCategory.id,
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create inventory for products
    await Inventory.create({
      productId: testProduct1.id,
      quantity: 100,
      reservedQuantity: 0,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    await Inventory.create({
      productId: testProduct2.id,
      quantity: 50,
      reservedQuantity: 0,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })
  })

  group.teardown(async () => {
    // Clean up test data
    await CartItem.query().whereHas('cart', (query) => {
      query.where('user_id', testUser.id)
    }).delete()
    await Cart.query().where('user_id', testUser.id).delete()
    await Inventory.query().whereIn('product_id', [testProduct1.id, testProduct2.id]).delete()
    await Product.query().where('tenant_id', testTenant.id).delete()
    await Category.query().where('tenant_id', testTenant.id).delete()
    await User.query().where('id', testUser.id).delete()
    await Tenant.query().where('id', testTenant.id).delete()
  })

  group.each.setup(async ({ client }) => {
    // Login before each test
    const loginResponse = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'carttest@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    authToken = loginResponse.body().token.token
  })

  group.each.teardown(async () => {
    // Clean up cart data after each test
    await CartItem.query().whereHas('cart', (query) => {
      query.where('user_id', testUser.id)
    }).delete()
    await Cart.query().where('user_id', testUser.id).delete()
  })

  test('should create a new cart', async ({ client, assert }) => {
    const response = await client
      .post(CART_ROUTE)
      .json({})
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(201)
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.userId, testUser.id)
    assert.equal(response.body().data.status, 'active')
  })

  test('should get current active cart', async ({ client, assert }) => {
    // First create a cart
    await client
      .post(CART_ROUTE)
      .json({})
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    const response = await client
      .get(`${CART_ROUTE}/current`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.userId, testUser.id)
    assert.equal(response.body().data.status, 'active')
  })

  test('should create new cart if no active cart exists', async ({ client, assert }) => {
    const response = await client
      .get(`${CART_ROUTE}/current`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.userId, testUser.id)
  })

  test('should add item to cart', async ({ client, assert }) => {
    // Create a cart first
    const cartResponse = await client
      .post(CART_ROUTE)
      .json({})
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    const cartId = cartResponse.body().data.id

    const itemData = {
      productId: testProduct1.id,
      quantity: 2,
    }

    const response = await client
      .post(`${CART_ROUTE}/${cartId}/items`)
      .json(itemData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(201)
    assert.equal(response.body().data.productId, testProduct1.id)
    assert.equal(response.body().data.quantity, 2)
    assert.equal(response.body().data.cartId, cartId)
  })

  test('should not add item with insufficient stock', async ({ client }) => {
    // Create a cart first
    const cartResponse = await client
      .post(CART_ROUTE)
      .json({})
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    const cartId = cartResponse.body().data.id

    const itemData = {
      productId: testProduct1.id,
      quantity: 150, // More than available stock (100)
    }

    const response = await client
      .post(`${CART_ROUTE}/${cartId}/items`)
      .json(itemData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should update cart item quantity', async ({ client, assert }) => {
    // Create cart and add item
    const cartResponse = await client
      .post(CART_ROUTE)
      .json({})
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    const cartId = cartResponse.body().data.id

    const itemResponse = await client
      .post(`${CART_ROUTE}/${cartId}/items`)
      .json({ productId: testProduct1.id, quantity: 2 })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    const itemId = itemResponse.body().data.id

    // Update quantity
    const updateResponse = await client
      .patch(`${CART_ROUTE}/items/${itemId}`)
      .json({ quantity: 5 })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    updateResponse.assertStatus(200)
    assert.equal(updateResponse.body().data.quantity, 5)
  })

  test('should remove item from cart', async ({ client }) => {
    // Create cart and add item
    const cartResponse = await client
      .post(CART_ROUTE)
      .json({})
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    const cartId = cartResponse.body().data.id

    const itemResponse = await client
      .post(`${CART_ROUTE}/${cartId}/items`)
      .json({ productId: testProduct1.id, quantity: 2 })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    const itemId = itemResponse.body().data.id

    // Remove item
    const deleteResponse = await client
      .delete(`${CART_ROUTE}/items/${itemId}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    deleteResponse.assertStatus(200)

    // Verify item is removed
    const cartWithItems = await client
      .get(`${CART_ROUTE}/${cartId}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    assert.equal(cartWithItems.body().data.items.length, 0)
  })

  test('should clear entire cart', async ({ client, assert }) => {
    // Create cart and add multiple items
    const cartResponse = await client
      .post(CART_ROUTE)
      .json({})
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    const cartId = cartResponse.body().data.id

    // Add items
    await client
      .post(`${CART_ROUTE}/${cartId}/items`)
      .json({ productId: testProduct1.id, quantity: 2 })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    await client
      .post(`${CART_ROUTE}/${cartId}/items`)
      .json({ productId: testProduct2.id, quantity: 1 })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    // Clear cart
    const clearResponse = await client
      .delete(`${CART_ROUTE}/${cartId}/clear`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    clearResponse.assertStatus(200)

    // Verify cart is empty
    const cartWithItems = await client
      .get(`${CART_ROUTE}/${cartId}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    assert.equal(cartWithItems.body().data.items.length, 0)
  })

  test('should calculate cart total correctly', async ({ client, assert }) => {
    // Create cart and add items
    const cartResponse = await client
      .post(CART_ROUTE)
      .json({})
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    const cartId = cartResponse.body().data.id

    // Add items: 2 x $25.00 + 1 x $50.00 = $100.00
    await client
      .post(`${CART_ROUTE}/${cartId}/items`)
      .json({ productId: testProduct1.id, quantity: 2 })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    await client
      .post(`${CART_ROUTE}/${cartId}/items`)
      .json({ productId: testProduct2.id, quantity: 1 })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    // Get cart with totals
    const cartResponse2 = await client
      .get(`${CART_ROUTE}/${cartId}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    assert.equal(cartResponse2.body().data.total, 100.00)
  })

  test('should not access cart from different tenant', async ({ client }) => {
    // Create another tenant and user
    const otherTenant = await Tenant.create({
      name: 'Other Tenant',
      slug: 'other-tenant-cart',
      domain: 'other-cart.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const hashedPassword = await hash.make('password123')
    const otherUser = await User.create({
      username: 'otheruser',
      email: 'otheruser@example.com',
      password: hashedPassword,
      firstName: 'Other',
      lastName: 'User',
      tenantId: otherTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const otherCart = await Cart.create({
      userId: otherUser.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Try to access other tenant's cart
    const response = await client
      .get(`${CART_ROUTE}/${otherCart.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)

    // Cleanup
    await Cart.query().where('id', otherCart.id).delete()
    await User.query().where('id', otherUser.id).delete()
    await Tenant.query().where('id', otherTenant.id).delete()
  })

  test('should require authentication', async ({ client }) => {
    const response = await client
      .get(`${CART_ROUTE}/current`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should require valid tenant', async ({ client }) => {
    const response = await client
      .get(`${CART_ROUTE}/current`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', 'invalid-tenant')

    response.assertStatus(404)
  })

  test('should validate cart item data', async ({ client }) => {
    // Create a cart first
    const cartResponse = await client
      .post(CART_ROUTE)
      .json({})
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    const cartId = cartResponse.body().data.id

    const invalidData = {
      productId: 99999, // Non-existent product
      quantity: -1, // Invalid negative quantity
    }

    const response = await client
      .post(`${CART_ROUTE}/${cartId}/items`)
      .json(invalidData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })
})