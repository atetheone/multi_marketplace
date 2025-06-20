import { test } from '@japa/runner'
import User from '#user/models/user'
import Tenant from '#tenant/models/tenant'
import Product from '#product/models/product'
import Category from '#product/models/category'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

const PRODUCTS_ROUTE = '/api/v1/products'

test.group('Products API', (group) => {
  let testUser: User
  let testTenant: Tenant
  let testCategory: Category
  let authToken: string

  group.setup(async () => {
    // Create test tenant
    testTenant = await Tenant.create({
      name: 'Test Marketplace',
      slug: 'test-marketplace',
      domain: 'test-marketplace.local',
      isActive: true,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test user
    const hashedPassword = await hash.make('password123')
    testUser = await User.create({
      username: 'producttest',
      email: 'producttest@example.com',
      password: hashedPassword,
      firstName: 'Product',
      lastName: 'Tester',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test category
    testCategory = await Category.create({
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices',
      tenantId: testTenant.id,
      isActive: true,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })
  })

  group.teardown(async () => {
    // Clean up test data
    await Product.query().where('tenant_id', testTenant.id).delete()
    await Category.query().where('tenant_id', testTenant.id).delete()
    await User.query().where('id', testUser.id).delete()
    await Tenant.query().where('id', testTenant.id).delete()
  })

  group.each.setup(async ({ client }) => {
    // Login before each test to get auth token
    const loginResponse = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'producttest@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    authToken = loginResponse.body().token.token
  })

  test('should get empty products list', async ({ client, assert }) => {
    const response = await client
      .get(PRODUCTS_ROUTE)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.length, 0)
  })

  test('should create a new product', async ({ client, assert }) => {
    const productData = {
      name: 'iPhone 15',
      description: 'Latest iPhone model',
      price: 999.99,
      sku: 'IPH15-001',
      categoryId: testCategory.id,
      status: 'active',
      isMarketplaceVisible: true,
    }

    const response = await client
      .post(PRODUCTS_ROUTE)
      .json(productData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(201)
    assert.equal(response.body().data.name, productData.name)
    assert.equal(response.body().data.price, productData.price)
    assert.equal(response.body().data.tenantId, testTenant.id)
  })

  test('should not create product with invalid data', async ({ client }) => {
    const invalidData = {
      name: '', // Empty name should fail validation
      price: -10, // Negative price should fail
    }

    const response = await client
      .post(PRODUCTS_ROUTE)
      .json(invalidData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should not create product with duplicate SKU', async ({ client }) => {
    // First create a product
    const productData = {
      name: 'Test Product 1',
      description: 'First test product',
      price: 100.0,
      sku: 'TEST-001',
      categoryId: testCategory.id,
      status: 'active',
    }

    await client
      .post(PRODUCTS_ROUTE)
      .json(productData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    // Try to create another product with same SKU
    const duplicateData = {
      name: 'Test Product 2',
      description: 'Second test product',
      price: 200.0,
      sku: 'TEST-001', // Same SKU
      categoryId: testCategory.id,
      status: 'active',
    }

    const response = await client
      .post(PRODUCTS_ROUTE)
      .json(duplicateData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should get single product by id', async ({ client, assert }) => {
    // Create a product first
    const product = await Product.create({
      name: 'Test Product',
      description: 'Test description',
      price: 99.99,
      sku: 'TEST-002',
      categoryId: testCategory.id,
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .get(`${PRODUCTS_ROUTE}/${product.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.id, product.id)
    assert.equal(response.body().data.name, product.name)
  })

  test('should not get product from different tenant', async ({ client }) => {
    // Create another tenant and product
    const otherTenant = await Tenant.create({
      name: 'Other Tenant',
      slug: 'other-tenant',
      domain: 'other.local',
      isActive: true,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const otherCategory = await Category.create({
      name: 'Other Category',
      slug: 'other-category',
      tenantId: otherTenant.id,
      isActive: true,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const otherProduct = await Product.create({
      name: 'Other Product',
      description: 'Product from other tenant',
      price: 199.99,
      sku: 'OTHER-001',
      categoryId: otherCategory.id,
      tenantId: otherTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .get(`${PRODUCTS_ROUTE}/${otherProduct.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)

    // Cleanup
    await Product.query().where('id', otherProduct.id).delete()
    await Category.query().where('id', otherCategory.id).delete()
    await Tenant.query().where('id', otherTenant.id).delete()
  })

  test('should update existing product', async ({ client, assert }) => {
    // Create a product first
    const product = await Product.create({
      name: 'Original Product',
      description: 'Original description',
      price: 50.0,
      sku: 'TEST-003',
      categoryId: testCategory.id,
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const updateData = {
      name: 'Updated Product',
      description: 'Updated description',
      price: 75.0,
    }

    const response = await client
      .put(`${PRODUCTS_ROUTE}/${product.id}`)
      .json(updateData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.name, updateData.name)
    assert.equal(response.body().data.price, updateData.price)
  })

  test('should delete existing product', async ({ client }) => {
    // Create a product first
    const product = await Product.create({
      name: 'Product to Delete',
      description: 'This will be deleted',
      price: 25.0,
      sku: 'TEST-004',
      categoryId: testCategory.id,
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .delete(`${PRODUCTS_ROUTE}/${product.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)

    // Verify product is deleted
    const getResponse = await client
      .get(`${PRODUCTS_ROUTE}/${product.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    getResponse.assertStatus(404)
  })

  test('should filter products by category', async ({ client, assert }) => {
    // Create products in different categories
    const category2 = await Category.create({
      name: 'Books',
      slug: 'books',
      tenantId: testTenant.id,
      isActive: true,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    await Product.create({
      name: 'Laptop',
      price: 1000,
      sku: 'LAPTOP-001',
      categoryId: testCategory.id, // Electronics
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    await Product.create({
      name: 'Programming Book',
      price: 50,
      sku: 'BOOK-001',
      categoryId: category2.id, // Books
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .get(PRODUCTS_ROUTE)
      .qs({ categoryId: testCategory.id })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.length, 1)
    assert.equal(response.body().data[0].name, 'Laptop')
  })

  test('should require authentication', async ({ client }) => {
    const response = await client.get(PRODUCTS_ROUTE).header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should require valid tenant', async ({ client }) => {
    const response = await client
      .get(PRODUCTS_ROUTE)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', 'invalid-tenant')

    response.assertStatus(404)
  })
})
