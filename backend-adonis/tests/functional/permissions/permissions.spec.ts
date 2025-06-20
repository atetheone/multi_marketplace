import { test } from '@japa/runner'
import User from '#user/models/user'
import Tenant from '#tenant/models/tenant'
import Role from '#role/models/role'
import Permission from '#role/models/permission'
import Resource from '#role/models/resource'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

const PERMISSIONS_ROUTE = '/api/v1/permissions'

test.group('Permissions API', (group) => {
  let adminUser: User
  let regularUser: User
  let testTenant: Tenant
  let adminRole: Role
  let testResource: Resource
  let adminToken: string
  let regularToken: string

  group.setup(async () => {
    // Create test tenant
    testTenant = await Tenant.create({
      name: 'Test Permission Tenant',
      slug: 'test-permission-tenant',
      domain: 'permission.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test resource
    testResource = await Resource.create({
      name: 'products',
      description: 'Product management resource',
      tenantId: testTenant.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create admin role
    adminRole = await Role.create({
      name: 'admin',
      tenantId: testTenant.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create permission management permissions for admin
    const permissionPermissions = await Permission.createMany([
      {
        name: 'create:permissions',
        description: 'Create permissions',
        tenantId: testTenant.id,
        resourceId: testResource.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        name: 'read:permissions',
        description: 'Read permissions',
        tenantId: testTenant.id,
        resourceId: testResource.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        name: 'update:permissions',
        description: 'Update permissions',
        tenantId: testTenant.id,
        resourceId: testResource.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        name: 'delete:permissions',
        description: 'Delete permissions',
        tenantId: testTenant.id,
        resourceId: testResource.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
    ])

    // Assign permissions to admin role
    await adminRole.related('permissions').attach(permissionPermissions.map(p => p.id))

    // Create admin user
    const hashedPassword = await hash.make('password123')
    adminUser = await User.create({
      username: 'permissionadmin',
      email: 'permissionadmin@example.com',
      password: hashedPassword,
      firstName: 'Permission',
      lastName: 'Admin',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Assign admin role
    await adminUser.related('roles').attach([adminRole.id])

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
    await Permission.query().where('tenant_id', testTenant.id).delete()
    await Role.query().where('tenant_id', testTenant.id).delete()
    await Resource.query().where('tenant_id', testTenant.id).delete()
    await User.query().whereIn('id', [adminUser.id, regularUser.id]).delete()
    await Tenant.query().where('id', testTenant.id).delete()
  })

  group.each.setup(async ({ client }) => {
    // Login admin user
    const adminLogin = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'permissionadmin@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    adminToken = adminLogin.body().token.token

    // Login regular user
    const regularLogin = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'regularuser@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    regularToken = regularLogin.body().token.token
  })

  test('should create a new permission (admin)', async ({ client, assert }) => {
    const permissionData = {
      name: 'create:orders',
      description: 'Create orders permission',
      resourceId: testResource.id,
    }

    const response = await client
      .post(PERMISSIONS_ROUTE)
      .json(permissionData)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(201)
    assert.equal(response.body().data.name, permissionData.name)
    assert.equal(response.body().data.description, permissionData.description)
    assert.equal(response.body().data.tenantId, testTenant.id)
    assert.equal(response.body().data.resourceId, testResource.id)
  })

  test('should not create permission with duplicate name', async ({ client }) => {
    // Create first permission
    const permissionData = {
      name: 'duplicate:permission',
      description: 'First permission',
      resourceId: testResource.id,
    }

    await client
      .post(PERMISSIONS_ROUTE)
      .json(permissionData)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    // Try to create duplicate
    const duplicateData = {
      name: 'duplicate:permission', // Same name
      description: 'Second permission',
      resourceId: testResource.id,
    }

    const response = await client
      .post(PERMISSIONS_ROUTE)
      .json(duplicateData)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should not allow regular user to create permissions', async ({ client }) => {
    const permissionData = {
      name: 'unauthorized:permission',
      description: 'Unauthorized permission',
      resourceId: testResource.id,
    }

    const response = await client
      .post(PERMISSIONS_ROUTE)
      .json(permissionData)
      .header('Authorization', `Bearer ${regularToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(403)
  })

  test('should get list of permissions (admin)', async ({ client, assert }) => {
    const response = await client
      .get(PERMISSIONS_ROUTE)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.isAbove(response.body().data.length, 0)
    
    // All permissions should belong to current tenant
    const allFromTenant = response.body().data.every((permission: any) => 
      permission.tenantId === testTenant.id
    )
    assert.isTrue(allFromTenant)
  })

  test('should not allow regular user to list permissions', async ({ client }) => {
    const response = await client
      .get(PERMISSIONS_ROUTE)
      .header('Authorization', `Bearer ${regularToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(403)
  })

  test('should get single permission details', async ({ client, assert }) => {
    // Create test permission
    const permission = await Permission.create({
      name: 'test:permission',
      description: 'Test permission for details',
      tenantId: testTenant.id,
      resourceId: testResource.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .get(`${PERMISSIONS_ROUTE}/${permission.id}`)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.id, permission.id)
    assert.equal(response.body().data.name, permission.name)
    assert.exists(response.body().data.resource)
  })

  test('should update existing permission', async ({ client, assert }) => {
    // Create permission to update
    const permission = await Permission.create({
      name: 'update:test',
      description: 'Original description',
      tenantId: testTenant.id,
      resourceId: testResource.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const updateData = {
      description: 'Updated description',
      name: 'update:test:modified',
    }

    const response = await client
      .put(`${PERMISSIONS_ROUTE}/${permission.id}`)
      .json(updateData)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.description, updateData.description)
    assert.equal(response.body().data.name, updateData.name)
  })

  test('should delete permission', async ({ client }) => {
    // Create permission to delete
    const permission = await Permission.create({
      name: 'delete:test',
      description: 'Permission to delete',
      tenantId: testTenant.id,
      resourceId: testResource.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .delete(`${PERMISSIONS_ROUTE}/${permission.id}`)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)

    // Verify permission is deleted
    const deletedPermission = await Permission.find(permission.id)
    assert.isNull(deletedPermission)
  })

  test('should not delete permission assigned to roles', async ({ client }) => {
    // Create permission and assign to role
    const permission = await Permission.create({
      name: 'assigned:permission',
      description: 'Permission assigned to role',
      tenantId: testTenant.id,
      resourceId: testResource.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    await adminRole.related('permissions').attach([permission.id])

    const response = await client
      .delete(`${PERMISSIONS_ROUTE}/${permission.id}`)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422) // Should not allow deletion
  })

  test('should not access permission from different tenant', async ({ client }) => {
    // Create another tenant and permission
    const otherTenant = await Tenant.create({
      name: 'Other Tenant',
      slug: 'other-tenant-perm',
      domain: 'other-perm.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const otherResource = await Resource.create({
      name: 'other-resource',
      description: 'Other resource',
      tenantId: otherTenant.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const otherPermission = await Permission.create({
      name: 'other:permission',
      description: 'Permission from other tenant',
      tenantId: otherTenant.id,
      resourceId: otherResource.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Try to access other tenant's permission
    const response = await client
      .get(`${PERMISSIONS_ROUTE}/${otherPermission.id}`)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)

    // Cleanup
    await Permission.query().where('id', otherPermission.id).delete()
    await Resource.query().where('id', otherResource.id).delete()
    await Tenant.query().where('id', otherTenant.id).delete()
  })

  test('should filter permissions by resource', async ({ client, assert }) => {
    // Create another resource
    const otherResource = await Resource.create({
      name: 'orders',
      description: 'Order management resource',
      tenantId: testTenant.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create permissions for both resources
    await Permission.createMany([
      {
        name: 'create:products:filtered',
        description: 'Create products permission',
        tenantId: testTenant.id,
        resourceId: testResource.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        name: 'create:orders:filtered',
        description: 'Create orders permission',
        tenantId: testTenant.id,
        resourceId: otherResource.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
    ])

    const response = await client
      .get(PERMISSIONS_ROUTE)
      .qs({ resourceId: testResource.id })
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    
    // All returned permissions should be for the specified resource
    const allForResource = response.body().data.every((permission: any) => 
      permission.resourceId === testResource.id
    )
    assert.isTrue(allForResource)

    // Cleanup
    await Resource.query().where('id', otherResource.id).delete()
  })

  test('should validate permission name format', async ({ client }) => {
    const invalidData = [
      {
        name: 'invalid_format', // Should use action:resource format
        description: 'Invalid format permission',
        resourceId: testResource.id,
      },
      {
        name: '', // Empty name
        description: 'Empty name permission',
        resourceId: testResource.id,
      },
      {
        name: 'create:', // Missing resource part
        description: 'Missing resource permission',
        resourceId: testResource.id,
      },
    ]

    for (const data of invalidData) {
      const response = await client
        .post(PERMISSIONS_ROUTE)
        .json(data)
        .header('Authorization', `Bearer ${adminToken}`)
        .header('X-Tenant-Slug', testTenant.slug)

      response.assertStatus(422)
    }
  })

  test('should require authentication', async ({ client }) => {
    const response = await client
      .get(PERMISSIONS_ROUTE)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should require valid tenant', async ({ client }) => {
    const response = await client
      .get(PERMISSIONS_ROUTE)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', 'invalid-tenant')

    response.assertStatus(404)
  })

  test('should search permissions by name', async ({ client, assert }) => {
    // Create test permissions
    await Permission.createMany([
      {
        name: 'create:users:search',
        description: 'Create users permission',
        tenantId: testTenant.id,
        resourceId: testResource.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        name: 'update:users:search',
        description: 'Update users permission',
        tenantId: testTenant.id,
        resourceId: testResource.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        name: 'create:products:search',
        description: 'Create products permission',
        tenantId: testTenant.id,
        resourceId: testResource.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
    ])

    const response = await client
      .get(PERMISSIONS_ROUTE)
      .qs({ search: 'users' })
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    
    // All returned permissions should contain 'users' in name
    const allContainUsers = response.body().data.every((permission: any) => 
      permission.name.includes('users')
    )
    assert.isTrue(allContainUsers)
  })

  test('should validate resource exists', async ({ client }) => {
    const invalidData = {
      name: 'create:invalid',
      description: 'Permission with invalid resource',
      resourceId: 99999, // Non-existent resource
    }

    const response = await client
      .post(PERMISSIONS_ROUTE)
      .json(invalidData)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should handle permission pagination', async ({ client, assert }) => {
    // Create multiple permissions
    const permissionPromises = Array.from({ length: 15 }, (_, index) =>
      Permission.create({
        name: `pagination:test:${index}`,
        description: `Pagination test permission ${index}`,
        tenantId: testTenant.id,
        resourceId: testResource.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      })
    )

    await Promise.all(permissionPromises)

    const response = await client
      .get(PERMISSIONS_ROUTE)
      .qs({ page: 1, limit: 10 })
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.isAtMost(response.body().data.length, 10)
    assert.exists(response.body().meta)
    assert.exists(response.body().meta.total)
  })
})