import { test } from '@japa/runner'
import User from '#user/models/user'
import Tenant from '#tenant/models/tenant'
import Role from '#role/models/role'
import Permission from '#role/models/permission'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

const TENANTS_ROUTE = '/api/v1/tenants'

test.group('Tenants API', (group) => {
  let superAdminUser: User
  let regularUser: User
  let testTenant: Tenant
  let superAdminToken: string
  let regularUserToken: string

  group.setup(async () => {
    // Create test tenant
    testTenant = await Tenant.create({
      name: 'Test Tenant Admin',
      slug: 'test-tenant-admin',
      domain: 'tenant-admin.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create super admin role and permissions
    const superAdminRole = await Role.create({
      name: 'super-admin',
      description: 'Super Administrator',
      tenantId: testTenant.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const tenantPermissions = await Permission.createMany([
      {
        name: 'create:tenants',
        description: 'Create tenants',
        tenantId: testTenant.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        name: 'read:tenants',
        description: 'Read tenants',
        tenantId: testTenant.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        name: 'update:tenants',
        description: 'Update tenants',
        tenantId: testTenant.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        name: 'delete:tenants',
        description: 'Delete tenants',
        tenantId: testTenant.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
    ])

    // Assign permissions to super admin role
    await superAdminRole.related('permissions').attach(tenantPermissions.map(p => p.id))

    // Create super admin user
    const hashedPassword = await hash.make('password123')
    superAdminUser = await User.create({
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Assign super admin role to user
    await superAdminUser.related('roles').attach([superAdminRole.id])

    // Create regular user
    regularUser = await User.create({
      username: 'regularuser',
      email: 'regularuser@example.com',
      password: hashedPassword,
      firstName: 'Regular',
      lastName: 'User',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })
  })

  group.teardown(async () => {
    // Clean up test data
    await User.query().whereIn('id', [superAdminUser.id, regularUser.id]).delete()
    await Permission.query().where('tenant_id', testTenant.id).delete()
    await Role.query().where('tenant_id', testTenant.id).delete()
    await Tenant.query().where('id', testTenant.id).delete()
  })

  group.each.setup(async ({ client }) => {
    // Login super admin before each test
    const superAdminLogin = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'superadmin@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    superAdminToken = superAdminLogin.body().token.token

    // Login regular user
    const regularUserLogin = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'regularuser@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    regularUserToken = regularUserLogin.body().token.token
  })

  test('should create a new tenant (super admin)', async ({ client, assert }) => {
    const tenantData = {
      name: 'New Test Tenant',
      slug: 'new-test-tenant',
      domain: 'new-test.local',
      description: 'A new test tenant',
      address: '123 New Street',
      phone: '+1234567890',
      email: 'contact@newtest.local',
    }

    const response = await client
      .post(TENANTS_ROUTE)
      .json(tenantData)
      .header('Authorization', `Bearer ${superAdminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(201)
    assert.equal(response.body().data.name, tenantData.name)
    assert.equal(response.body().data.slug, tenantData.slug)
    assert.equal(response.body().data.domain, tenantData.domain)
    assert.equal(response.body().data.status, 'active')

    // Cleanup created tenant
    await Tenant.query().where('slug', tenantData.slug).delete()
  })

  test('should not create tenant with duplicate slug', async ({ client }) => {
    const tenantData = {
      name: 'Duplicate Slug Tenant',
      slug: testTenant.slug, // Use existing slug
      domain: 'duplicate.local',
    }

    const response = await client
      .post(TENANTS_ROUTE)
      .json(tenantData)
      .header('Authorization', `Bearer ${superAdminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should not allow regular user to create tenant', async ({ client }) => {
    const tenantData = {
      name: 'Unauthorized Tenant',
      slug: 'unauthorized-tenant',
      domain: 'unauthorized.local',
    }

    const response = await client
      .post(TENANTS_ROUTE)
      .json(tenantData)
      .header('Authorization', `Bearer ${regularUserToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(403)
  })

  test('should get list of tenants (authorized user)', async ({ client, assert }) => {
    const response = await client
      .get(TENANTS_ROUTE)
      .header('Authorization', `Bearer ${superAdminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.isAbove(response.body().data.length, 0)
  })

  test('should not allow unauthorized user to list tenants', async ({ client }) => {
    const response = await client
      .get(TENANTS_ROUTE)
      .header('Authorization', `Bearer ${regularUserToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(403)
  })

  test('should get single tenant details', async ({ client, assert }) => {
    const response = await client
      .get(`${TENANTS_ROUTE}/${testTenant.id}`)
      .header('Authorization', `Bearer ${superAdminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.id, testTenant.id)
    assert.equal(response.body().data.name, testTenant.name)
    assert.equal(response.body().data.slug, testTenant.slug)
  })

  test('should update tenant details', async ({ client, assert }) => {
    // Create a tenant to update
    const newTenant = await Tenant.create({
      name: 'Tenant to Update',
      slug: 'tenant-to-update',
      domain: 'update.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const updateData = {
      name: 'Updated Tenant Name',
      description: 'Updated description',
      phone: '+9876543210',
      status: 'inactive',
    }

    const response = await client
      .put(`${TENANTS_ROUTE}/${newTenant.id}`)
      .json(updateData)
      .header('Authorization', `Bearer ${superAdminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.name, updateData.name)
    assert.equal(response.body().data.description, updateData.description)
    assert.equal(response.body().data.status, updateData.status)

    // Cleanup
    await Tenant.query().where('id', newTenant.id).delete()
  })

  test('should not update tenant with invalid data', async ({ client }) => {
    const invalidData = {
      slug: '', // Empty slug should fail validation
      status: 'invalid_status', // Invalid status
    }

    const response = await client
      .put(`${TENANTS_ROUTE}/${testTenant.id}`)
      .json(invalidData)
      .header('Authorization', `Bearer ${superAdminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should delete tenant', async ({ client }) => {
    // Create a tenant to delete
    const tenantToDelete = await Tenant.create({
      name: 'Tenant to Delete',
      slug: 'tenant-to-delete',
      domain: 'delete.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .delete(`${TENANTS_ROUTE}/${tenantToDelete.id}`)
      .header('Authorization', `Bearer ${superAdminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)

    // Verify tenant is deleted
    const deletedTenant = await Tenant.find(tenantToDelete.id)
    assert.isNull(deletedTenant)
  })

  test('should not allow regular user to delete tenant', async ({ client }) => {
    // Create a tenant
    const protectedTenant = await Tenant.create({
      name: 'Protected Tenant',
      slug: 'protected-tenant',
      domain: 'protected.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .delete(`${TENANTS_ROUTE}/${protectedTenant.id}`)
      .header('Authorization', `Bearer ${regularUserToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(403)

    // Cleanup
    await Tenant.query().where('id', protectedTenant.id).delete()
  })

  test('should not delete non-existent tenant', async ({ client }) => {
    const response = await client
      .delete(`${TENANTS_ROUTE}/99999`)
      .header('Authorization', `Bearer ${superAdminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)
  })

  test('should filter tenants by status', async ({ client, assert }) => {
    // Create tenants with different statuses
    const activeTenant = await Tenant.create({
      name: 'Active Tenant',
      slug: 'active-tenant-filter',
      domain: 'active-filter.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const inactiveTenant = await Tenant.create({
      name: 'Inactive Tenant',
      slug: 'inactive-tenant-filter',
      domain: 'inactive-filter.local',
      status: 'inactive',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .get(TENANTS_ROUTE)
      .qs({ status: 'active' })
      .header('Authorization', `Bearer ${superAdminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    
    // All returned tenants should have 'active' status
    const allActive = response.body().data.every((tenant: any) => tenant.status === 'active')
    assert.isTrue(allActive)

    // Cleanup
    await Tenant.query().whereIn('id', [activeTenant.id, inactiveTenant.id]).delete()
  })

  test('should require authentication', async ({ client }) => {
    const response = await client
      .get(TENANTS_ROUTE)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should require valid tenant context', async ({ client }) => {
    const response = await client
      .get(TENANTS_ROUTE)
      .header('Authorization', `Bearer ${superAdminToken}`)
      .header('X-Tenant-Slug', 'invalid-tenant')

    response.assertStatus(404)
  })

  test('should validate tenant creation data', async ({ client }) => {
    const invalidData = {
      name: '', // Empty name
      slug: 'invalid slug with spaces', // Invalid slug format
      domain: 'invalid-domain', // Invalid domain format
      email: 'invalid-email', // Invalid email format
    }

    const response = await client
      .post(TENANTS_ROUTE)
      .json(invalidData)
      .header('Authorization', `Bearer ${superAdminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should handle tenant metrics and stats', async ({ client, assert }) => {
    // Create a tenant with some metrics
    const metricsData = {
      name: 'Metrics Tenant',
      slug: 'metrics-tenant',
      domain: 'metrics.local',
      productCount: 100,
      rating: 4.5,
      isFeatured: true,
    }

    const response = await client
      .post(TENANTS_ROUTE)
      .json(metricsData)
      .header('Authorization', `Bearer ${superAdminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(201)
    assert.equal(response.body().data.productCount, metricsData.productCount)
    assert.equal(response.body().data.rating, metricsData.rating)
    assert.equal(response.body().data.isFeatured, metricsData.isFeatured)

    // Cleanup
    await Tenant.query().where('slug', metricsData.slug).delete()
  })
})