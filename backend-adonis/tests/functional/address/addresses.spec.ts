import { test } from '@japa/runner'
import User from '#user/models/user'
import Tenant from '#tenant/models/tenant'
import Address from '#address/models/address'
import DeliveryZone from '#address/models/delivery_zone'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

const ADDRESSES_ROUTE = '/api/v1/addresses'

test.group('Addresses API', (group) => {
  let testUser: User
  let otherUser: User
  let testTenant: Tenant
  let testZone: DeliveryZone
  let authToken: string
  let otherUserToken: string

  group.setup(async () => {
    // Create test tenant
    testTenant = await Tenant.create({
      name: 'Test Address Store',
      slug: 'test-address-store',
      domain: 'address.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create delivery zone
    testZone = await DeliveryZone.create({
      name: 'Test Delivery Zone',
      description: 'Test zone for addresses',
      tenantId: testTenant.id,
      pricePerKm: 1.50,
      basePrice: 3.00,
      maxDistance: 25,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test users
    const hashedPassword = await hash.make('password123')
    testUser = await User.create({
      username: 'addresstest',
      email: 'addresstest@example.com',
      password: hashedPassword,
      firstName: 'Address',
      lastName: 'Tester',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    otherUser = await User.create({
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
  })

  group.teardown(async () => {
    // Clean up test data
    await Address.query().whereHas('users', (query) => {
      query.whereIn('user_id', [testUser.id, otherUser.id])
    }).delete()
    await DeliveryZone.query().where('tenant_id', testTenant.id).delete()
    await User.query().whereIn('id', [testUser.id, otherUser.id]).delete()
    await Tenant.query().where('id', testTenant.id).delete()
  })

  group.each.setup(async ({ client }) => {
    // Login before each test
    const loginResponse = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'addresstest@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    authToken = loginResponse.body().token.token

    // Login other user
    const otherLoginResponse = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'otheruser@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    otherUserToken = otherLoginResponse.body().token.token
  })

  group.each.teardown(async () => {
    // Clean up address data after each test
    await Address.query().whereHas('users', (query) => {
      query.whereIn('user_id', [testUser.id, otherUser.id])
    }).delete()
  })

  test('should create a new address', async ({ client, assert }) => {
    const addressData = {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
      latitude: 14.6937,
      longitude: -17.4441,
      deliveryZoneId: testZone.id,
      type: 'shipping',
      isDefault: true,
    }

    const response = await client
      .post(ADDRESSES_ROUTE)
      .json(addressData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(201)
    assert.equal(response.body().data.street, addressData.street)
    assert.equal(response.body().data.city, addressData.city)
    assert.equal(response.body().data.deliveryZoneId, testZone.id)
    assert.equal(response.body().data.type, addressData.type)
    assert.equal(response.body().data.isDefault, addressData.isDefault)
  })

  test('should not create address with invalid data', async ({ client }) => {
    const invalidData = {
      street: '', // Empty street
      city: '',   // Empty city
      latitude: 200, // Invalid latitude
      longitude: 200, // Invalid longitude
    }

    const response = await client
      .post(ADDRESSES_ROUTE)
      .json(invalidData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should get user addresses', async ({ client, assert }) => {
    // Create test addresses
    const address1 = await Address.create({
      street: '123 First Street',
      city: 'First City',
      state: 'First State',
      postalCode: '11111',
      country: 'Test Country',
      latitude: 14.6937,
      longitude: -17.4441,
      deliveryZoneId: testZone.id,
      type: 'shipping',
      isDefault: true,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const address2 = await Address.create({
      street: '456 Second Street',
      city: 'Second City',
      state: 'Second State',
      postalCode: '22222',
      country: 'Test Country',
      latitude: 14.7000,
      longitude: -17.5000,
      deliveryZoneId: testZone.id,
      type: 'billing',
      isDefault: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Associate addresses with user
    await testUser.related('addresses').attach([address1.id, address2.id])

    const response = await client
      .get(ADDRESSES_ROUTE)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.equal(response.body().data.length, 2)
  })

  test('should get single address by id', async ({ client, assert }) => {
    // Create test address
    const address = await Address.create({
      street: '789 Single Street',
      city: 'Single City',
      state: 'Single State',
      postalCode: '33333',
      country: 'Test Country',
      latitude: 14.6937,
      longitude: -17.4441,
      deliveryZoneId: testZone.id,
      type: 'shipping',
      isDefault: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Associate with user
    await testUser.related('addresses').attach([address.id])

    const response = await client
      .get(`${ADDRESSES_ROUTE}/${address.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.id, address.id)
    assert.equal(response.body().data.street, address.street)
  })

  test('should not access address from different user', async ({ client }) => {
    // Create address for other user
    const otherAddress = await Address.create({
      street: '999 Other Street',
      city: 'Other City',
      state: 'Other State',
      postalCode: '99999',
      country: 'Test Country',
      latitude: 14.6937,
      longitude: -17.4441,
      deliveryZoneId: testZone.id,
      type: 'shipping',
      isDefault: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Associate with other user
    await otherUser.related('addresses').attach([otherAddress.id])

    // Try to access with different user
    const response = await client
      .get(`${ADDRESSES_ROUTE}/${otherAddress.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)
  })

  test('should update existing address', async ({ client, assert }) => {
    // Create test address
    const address = await Address.create({
      street: 'Original Street',
      city: 'Original City',
      state: 'Original State',
      postalCode: '00000',
      country: 'Test Country',
      latitude: 14.6937,
      longitude: -17.4441,
      deliveryZoneId: testZone.id,
      type: 'shipping',
      isDefault: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Associate with user
    await testUser.related('addresses').attach([address.id])

    const updateData = {
      street: 'Updated Street',
      city: 'Updated City',
      postalCode: '55555',
      type: 'billing',
      isDefault: true,
    }

    const response = await client
      .put(`${ADDRESSES_ROUTE}/${address.id}`)
      .json(updateData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.street, updateData.street)
    assert.equal(response.body().data.city, updateData.city)
    assert.equal(response.body().data.type, updateData.type)
    assert.equal(response.body().data.isDefault, updateData.isDefault)
  })

  test('should delete address', async ({ client }) => {
    // Create test address
    const address = await Address.create({
      street: 'Delete Street',
      city: 'Delete City',
      state: 'Delete State',
      postalCode: '44444',
      country: 'Test Country',
      latitude: 14.6937,
      longitude: -17.4441,
      deliveryZoneId: testZone.id,
      type: 'shipping',
      isDefault: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Associate with user
    await testUser.related('addresses').attach([address.id])

    const response = await client
      .delete(`${ADDRESSES_ROUTE}/${address.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)

    // Verify address is deleted
    const deletedAddress = await Address.find(address.id)
    assert.isNull(deletedAddress)
  })

  test('should get default shipping address', async ({ client, assert }) => {
    // Create multiple addresses with one default shipping
    const defaultAddress = await Address.create({
      street: 'Default Shipping Street',
      city: 'Default City',
      state: 'Default State',
      postalCode: '77777',
      country: 'Test Country',
      latitude: 14.6937,
      longitude: -17.4441,
      deliveryZoneId: testZone.id,
      type: 'shipping',
      isDefault: true,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const regularAddress = await Address.create({
      street: 'Regular Street',
      city: 'Regular City',
      state: 'Regular State',
      postalCode: '88888',
      country: 'Test Country',
      latitude: 14.7000,
      longitude: -17.5000,
      deliveryZoneId: testZone.id,
      type: 'shipping',
      isDefault: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Associate with user
    await testUser.related('addresses').attach([defaultAddress.id, regularAddress.id])

    const response = await client
      .get(`${ADDRESSES_ROUTE}/default/shipping`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.id, defaultAddress.id)
    assert.equal(response.body().data.isDefault, true)
    assert.equal(response.body().data.type, 'shipping')
  })

  test('should handle no default shipping address', async ({ client }) => {
    // Create non-default addresses
    const address = await Address.create({
      street: 'Non Default Street',
      city: 'Non Default City',
      state: 'Non Default State',
      postalCode: '66666',
      country: 'Test Country',
      latitude: 14.6937,
      longitude: -17.4441,
      deliveryZoneId: testZone.id,
      type: 'shipping',
      isDefault: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Associate with user
    await testUser.related('addresses').attach([address.id])

    const response = await client
      .get(`${ADDRESSES_ROUTE}/default/shipping`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)
  })

  test('should filter addresses by type', async ({ client, assert }) => {
    // Create addresses of different types
    const shippingAddress = await Address.create({
      street: 'Shipping Street',
      city: 'Shipping City',
      state: 'Shipping State',
      postalCode: '11111',
      country: 'Test Country',
      latitude: 14.6937,
      longitude: -17.4441,
      deliveryZoneId: testZone.id,
      type: 'shipping',
      isDefault: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const billingAddress = await Address.create({
      street: 'Billing Street',
      city: 'Billing City',
      state: 'Billing State',
      postalCode: '22222',
      country: 'Test Country',
      latitude: 14.7000,
      longitude: -17.5000,
      deliveryZoneId: testZone.id,
      type: 'billing',
      isDefault: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Associate with user
    await testUser.related('addresses').attach([shippingAddress.id, billingAddress.id])

    const response = await client
      .get(ADDRESSES_ROUTE)
      .qs({ type: 'shipping' })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.equal(response.body().data.length, 1)
    assert.equal(response.body().data[0].type, 'shipping')
  })

  test('should require authentication', async ({ client }) => {
    const response = await client
      .get(ADDRESSES_ROUTE)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should require valid tenant', async ({ client }) => {
    const response = await client
      .get(ADDRESSES_ROUTE)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', 'invalid-tenant')

    response.assertStatus(404)
  })

  test('should validate coordinates', async ({ client }) => {
    const invalidCoordinatesData = {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
      latitude: 200, // Invalid latitude (> 90)
      longitude: 300, // Invalid longitude (> 180)
      deliveryZoneId: testZone.id,
      type: 'shipping',
    }

    const response = await client
      .post(ADDRESSES_ROUTE)
      .json(invalidCoordinatesData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should validate delivery zone exists', async ({ client }) => {
    const invalidZoneData = {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
      latitude: 14.6937,
      longitude: -17.4441,
      deliveryZoneId: 99999, // Non-existent delivery zone
      type: 'shipping',
    }

    const response = await client
      .post(ADDRESSES_ROUTE)
      .json(invalidZoneData)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should handle setting new default address', async ({ client, assert }) => {
    // Create current default address
    const currentDefault = await Address.create({
      street: 'Current Default Street',
      city: 'Current Default City',
      state: 'Current Default State',
      postalCode: '11111',
      country: 'Test Country',
      latitude: 14.6937,
      longitude: -17.4441,
      deliveryZoneId: testZone.id,
      type: 'shipping',
      isDefault: true,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const newAddress = await Address.create({
      street: 'New Address Street',
      city: 'New Address City',
      state: 'New Address State',
      postalCode: '22222',
      country: 'Test Country',
      latitude: 14.7000,
      longitude: -17.5000,
      deliveryZoneId: testZone.id,
      type: 'shipping',
      isDefault: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Associate with user
    await testUser.related('addresses').attach([currentDefault.id, newAddress.id])

    // Set new address as default
    const response = await client
      .put(`${ADDRESSES_ROUTE}/${newAddress.id}`)
      .json({ isDefault: true })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.isDefault, true)

    // Verify old default is no longer default
    await currentDefault.refresh()
    assert.equal(currentDefault.isDefault, false)
  })
})