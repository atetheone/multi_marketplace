import { test } from '@japa/runner'
import User from '#user/models/user'
import Tenant from '#tenant/models/tenant'
import Product from '#product/models/product'
import Category from '#product/models/category'
import Inventory from '#product/models/inventory'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

const INVENTORY_ROUTE = '/api/v1/products/inventory'

test.group('Inventory API', (group) => {
  let testUser: User
  let testTenant: Tenant
  let testCategory: Category
  let testProduct: Product
  let authToken: string

  group.setup(async () => {
    // Create test tenant
    testTenant = await Tenant.create({
      name: 'Test Inventory',
      slug: 'test-inventory',
      domain: 'inventory.local',
      isActive: true,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test user
    const hashedPassword = await hash.make('password123')
    testUser = await User.create({
      username: 'inventorytest',
      email: 'inventorytest@example.com',
      password: hashedPassword,
      firstName: 'Inventory',
      lastName: 'Tester',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test category
    testCategory = await Category.create({
      name: 'Test Category',
      slug: 'test-category',
      tenantId: testTenant.id,
      isActive: true,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test product
    testProduct = await Product.create({
      name: 'Test Product',
      description: 'Product for inventory testing',
      price: 100.00,
      sku: 'TEST-INV-001',
      categoryId: testCategory.id,
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create inventory record
    await Inventory.create({
      productId: testProduct.id,
      quantity: 100,
      reservedQuantity: 0,
      minThreshold: 10,
      maxThreshold: 500,
      autoReorder: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })
  })

  group.teardown(async () => {
    // Clean up test data
    await Inventory.query().whereHas('product', (query) => {
      query.where('tenant_id', testTenant.id)
    }).delete()
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
        email: 'inventorytest@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    authToken = loginResponse.body().token.token
  })

  test('should update product stock', async ({ client, assert }) => {
    const stockData = {
      quantity: 150,
      operation: 'set', // set, add, subtract
    }

    const response = await client
      .patch(`${INVENTORY_ROUTE}/${testProduct.id}/stock`)
      .json(stockData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.quantity, 150)
  })

  test('should add to existing stock', async ({ client, assert }) => {
    // First set initial stock
    await client
      .patch(`${INVENTORY_ROUTE}/${testProduct.id}/stock`)
      .json({ quantity: 100, operation: 'set' })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    // Then add to stock
    const response = await client
      .patch(`${INVENTORY_ROUTE}/${testProduct.id}/stock`)
      .json({ quantity: 25, operation: 'add' })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.quantity, 125)
  })

  test('should subtract from existing stock', async ({ client, assert }) => {
    // First set initial stock
    await client
      .patch(`${INVENTORY_ROUTE}/${testProduct.id}/stock`)
      .json({ quantity: 100, operation: 'set' })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    // Then subtract from stock
    const response = await client
      .patch(`${INVENTORY_ROUTE}/${testProduct.id}/stock`)
      .json({ quantity: 20, operation: 'subtract' })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.quantity, 80)
  })

  test('should not allow negative stock', async ({ client }) => {
    // First set low stock
    await client
      .patch(`${INVENTORY_ROUTE}/${testProduct.id}/stock`)
      .json({ quantity: 5, operation: 'set' })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    // Try to subtract more than available
    const response = await client
      .patch(`${INVENTORY_ROUTE}/${testProduct.id}/stock`)
      .json({ quantity: 10, operation: 'subtract' })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should update inventory settings', async ({ client, assert }) => {
    const settingsData = {
      minThreshold: 20,
      maxThreshold: 1000,
      autoReorder: true,
    }

    const response = await client
      .patch(`${INVENTORY_ROUTE}/${testProduct.id}/settings`)
      .json(settingsData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.minThreshold, 20)
    assert.equal(response.body().data.maxThreshold, 1000)
    assert.equal(response.body().data.autoReorder, true)
  })

  test('should get stock history', async ({ client, assert }) => {
    // Make some stock changes to create history
    await client
      .patch(`${INVENTORY_ROUTE}/${testProduct.id}/stock`)
      .json({ quantity: 200, operation: 'set' })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    await client
      .patch(`${INVENTORY_ROUTE}/${testProduct.id}/stock`)
      .json({ quantity: 50, operation: 'add' })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    const response = await client
      .get(`${INVENTORY_ROUTE}/${testProduct.id}/history`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
  })

  test('should not access inventory from different tenant', async ({ client }) => {
    // Create another tenant and product
    const otherTenant = await Tenant.create({
      name: 'Other Tenant',
      slug: 'other-tenant-inv',
      domain: 'other-inv.local',
      isActive: true,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const otherCategory = await Category.create({
      name: 'Other Category',
      slug: 'other-category-inv',
      tenantId: otherTenant.id,
      isActive: true,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const otherProduct = await Product.create({
      name: 'Other Product',
      price: 100,
      sku: 'OTHER-INV-001',
      categoryId: otherCategory.id,
      tenantId: otherTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    await Inventory.create({
      productId: otherProduct.id,
      quantity: 50,
      reservedQuantity: 0,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .patch(`${INVENTORY_ROUTE}/${otherProduct.id}/stock`)
      .json({ quantity: 100, operation: 'set' })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)

    // Cleanup
    await Inventory.query().where('product_id', otherProduct.id).delete()
    await Product.query().where('id', otherProduct.id).delete()
    await Category.query().where('id', otherCategory.id).delete()
    await Tenant.query().where('id', otherTenant.id).delete()
  })

  test('should require valid product ID', async ({ client }) => {
    const response = await client
      .patch(`${INVENTORY_ROUTE}/99999/stock`)
      .json({ quantity: 100, operation: 'set' })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)
  })

  test('should require authentication for inventory operations', async ({ client }) => {
    const response = await client
      .patch(`${INVENTORY_ROUTE}/${testProduct.id}/stock`)
      .json({ quantity: 100, operation: 'set' })
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should validate stock operation data', async ({ client }) => {
    const invalidData = {
      quantity: -10, // Invalid negative quantity
      operation: 'invalid', // Invalid operation
    }

    const response = await client
      .patch(`${INVENTORY_ROUTE}/${testProduct.id}/stock`)
      .json(invalidData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })
})