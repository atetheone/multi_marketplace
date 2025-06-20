import { test } from '@japa/runner'
import User from '#user/models/user'
import Tenant from '#tenant/models/tenant'
import Product from '#product/models/product'
import Category from '#product/models/category'
import Cart from '#cart/models/cart'
import CartItem from '#cart/models/cart_item'
import Order from '#order/models/order'
import OrderItem from '#order/models/order_item'
import Inventory from '#product/models/inventory'
import Address from '#address/models/address'
import DeliveryZone from '#address/models/delivery_zone'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

const ORDERS_ROUTE = '/api/v1/orders'

test.group('Orders API', (group) => {
  let testUser: User
  let testTenant: Tenant
  let testCategory: Category
  let testProduct1: Product
  let testProduct2: Product
  let testZone: DeliveryZone
  let testAddress: Address
  let authToken: string

  group.setup(async () => {
    // Create test tenant
    testTenant = await Tenant.create({
      name: 'Test Order Store',
      slug: 'test-order-store',
      domain: 'order.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test user
    const hashedPassword = await hash.make('password123')
    testUser = await User.create({
      username: 'ordertest',
      email: 'ordertest@example.com',
      password: hashedPassword,
      firstName: 'Order',
      lastName: 'Tester',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test category
    testCategory = await Category.create({
      name: 'Order Test Category',
      slug: 'order-test-category',
      tenantId: testTenant.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test products
    testProduct1 = await Product.create({
      name: 'Order Test Product 1',
      description: 'First order test product',
      price: 30.00,
      sku: 'ORDER-TEST-001',
      categoryId: testCategory.id,
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    testProduct2 = await Product.create({
      name: 'Order Test Product 2',
      description: 'Second order test product',
      price: 45.00,
      sku: 'ORDER-TEST-002',
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

    // Create delivery zone
    testZone = await DeliveryZone.create({
      name: 'Test Zone',
      description: 'Test delivery zone',
      tenantId: testTenant.id,
      pricePerKm: 2.00,
      basePrice: 5.00,
      maxDistance: 50,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create address
    testAddress = await Address.create({
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
      latitude: 14.6937,
      longitude: -17.4441,
      deliveryZoneId: testZone.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })
  })

  group.teardown(async () => {
    // Clean up test data
    await OrderItem.query().whereHas('order', (query) => {
      query.where('user_id', testUser.id)
    }).delete()
    await Order.query().where('user_id', testUser.id).delete()
    await CartItem.query().whereHas('cart', (query) => {
      query.where('user_id', testUser.id)
    }).delete()
    await Cart.query().where('user_id', testUser.id).delete()
    await Address.query().where('id', testAddress.id).delete()
    await DeliveryZone.query().where('tenant_id', testTenant.id).delete()
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
        email: 'ordertest@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    authToken = loginResponse.body().token.token
  })

  group.each.teardown(async () => {
    // Clean up order data after each test
    await OrderItem.query().whereHas('order', (query) => {
      query.where('user_id', testUser.id)
    }).delete()
    await Order.query().where('user_id', testUser.id).delete()
    await CartItem.query().whereHas('cart', (query) => {
      query.where('user_id', testUser.id)
    }).delete()
    await Cart.query().where('user_id', testUser.id).delete()
  })

  test('should create order from cart', async ({ client, assert }) => {
    // Create cart with items
    const cart = await Cart.create({
      userId: testUser.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    await CartItem.create({
      cartId: cart.id,
      productId: testProduct1.id,
      quantity: 2,
      unitPrice: testProduct1.price,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    await CartItem.create({
      cartId: cart.id,
      productId: testProduct2.id,
      quantity: 1,
      unitPrice: testProduct2.price,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const orderData = {
      cartId: cart.id,
      shippingAddressId: testAddress.id,
      paymentMethod: 'cash_on_delivery',
      notes: 'Test order notes',
    }

    const response = await client
      .post(ORDERS_ROUTE)
      .json(orderData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(201)
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.userId, testUser.id)
    assert.equal(response.body().data.status, 'pending')
    assert.equal(response.body().data.total, 105.00) // 2*30 + 1*45 = 105
    assert.exists(response.body().data.orderNumber)
  })

  test('should not create order with empty cart', async ({ client }) => {
    // Create empty cart
    const cart = await Cart.create({
      userId: testUser.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const orderData = {
      cartId: cart.id,
      shippingAddressId: testAddress.id,
      paymentMethod: 'cash_on_delivery',
    }

    const response = await client
      .post(ORDERS_ROUTE)
      .json(orderData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should not create order with insufficient stock', async ({ client }) => {
    // Create cart with item exceeding stock
    const cart = await Cart.create({
      userId: testUser.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    await CartItem.create({
      cartId: cart.id,
      productId: testProduct2.id,
      quantity: 60, // More than available stock (50)
      unitPrice: testProduct2.price,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const orderData = {
      cartId: cart.id,
      shippingAddressId: testAddress.id,
      paymentMethod: 'cash_on_delivery',
    }

    const response = await client
      .post(ORDERS_ROUTE)
      .json(orderData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should get user orders', async ({ client, assert }) => {
    // Create test order
    const order = await Order.create({
      userId: testUser.id,
      orderNumber: 'TEST-ORDER-001',
      status: 'pending',
      subtotal: 100.00,
      shippingCost: 10.00,
      total: 110.00,
      shippingAddressId: testAddress.id,
      paymentMethod: 'cash_on_delivery',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .get(`${ORDERS_ROUTE}/me`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.equal(response.body().data.length, 1)
    assert.equal(response.body().data[0].id, order.id)
  })

  test('should get single order details', async ({ client, assert }) => {
    // Create test order with items
    const order = await Order.create({
      userId: testUser.id,
      orderNumber: 'TEST-ORDER-002',
      status: 'pending',
      subtotal: 75.00,
      shippingCost: 5.00,
      total: 80.00,
      shippingAddressId: testAddress.id,
      paymentMethod: 'cash_on_delivery',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    await OrderItem.create({
      orderId: order.id,
      productId: testProduct1.id,
      quantity: 1,
      unitPrice: testProduct1.price,
      totalPrice: testProduct1.price,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .get(`${ORDERS_ROUTE}/${order.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.id, order.id)
    assert.exists(response.body().data.items)
    assert.equal(response.body().data.items.length, 1)
  })

  test('should cancel pending order', async ({ client, assert }) => {
    // Create test order
    const order = await Order.create({
      userId: testUser.id,
      orderNumber: 'TEST-ORDER-003',
      status: 'pending',
      subtotal: 50.00,
      shippingCost: 5.00,
      total: 55.00,
      shippingAddressId: testAddress.id,
      paymentMethod: 'cash_on_delivery',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .post(`${ORDERS_ROUTE}/${order.id}/cancel`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.status, 'cancelled')
  })

  test('should not cancel processed order', async ({ client }) => {
    // Create test order with processed status
    const order = await Order.create({
      userId: testUser.id,
      orderNumber: 'TEST-ORDER-004',
      status: 'processing',
      subtotal: 50.00,
      shippingCost: 5.00,
      total: 55.00,
      shippingAddressId: testAddress.id,
      paymentMethod: 'cash_on_delivery',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .post(`${ORDERS_ROUTE}/${order.id}/cancel`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should not access order from different user', async ({ client }) => {
    // Create another user
    const hashedPassword = await hash.make('password123')
    const otherUser = await User.create({
      username: 'otheruser',
      email: 'otheruser@example.com',
      password: hashedPassword,
      firstName: 'Other',
      lastName: 'User',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create order for other user
    const otherOrder = await Order.create({
      userId: otherUser.id,
      orderNumber: 'OTHER-ORDER-001',
      status: 'pending',
      subtotal: 100.00,
      shippingCost: 10.00,
      total: 110.00,
      shippingAddressId: testAddress.id,
      paymentMethod: 'cash_on_delivery',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .get(`${ORDERS_ROUTE}/${otherOrder.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)

    // Cleanup
    await Order.query().where('id', otherOrder.id).delete()
    await User.query().where('id', otherUser.id).delete()
  })

  test('should calculate shipping cost correctly', async ({ client, assert }) => {
    // Create cart with items
    const cart = await Cart.create({
      userId: testUser.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    await CartItem.create({
      cartId: cart.id,
      productId: testProduct1.id,
      quantity: 1,
      unitPrice: testProduct1.price,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const orderData = {
      cartId: cart.id,
      shippingAddressId: testAddress.id,
      paymentMethod: 'cash_on_delivery',
    }

    const response = await client
      .post(ORDERS_ROUTE)
      .json(orderData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(201)
    assert.exists(response.body().data.shippingCost)
    // Should include base price from delivery zone
    assert.isAbove(response.body().data.shippingCost, 0)
  })

  test('should require authentication', async ({ client }) => {
    const response = await client
      .get(`${ORDERS_ROUTE}/me`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should require valid tenant', async ({ client }) => {
    const response = await client
      .get(`${ORDERS_ROUTE}/me`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', 'invalid-tenant')

    response.assertStatus(404)
  })

  test('should validate order creation data', async ({ client }) => {
    const invalidData = {
      cartId: 99999, // Non-existent cart
      shippingAddressId: 99999, // Non-existent address
      paymentMethod: 'invalid_method', // Invalid payment method
    }

    const response = await client
      .post(ORDERS_ROUTE)
      .json(invalidData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })
})