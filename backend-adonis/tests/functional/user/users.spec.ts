import { test } from '@japa/runner'
import User from '#user/models/user'
import UserProfile from '#user/models/user_profile'
import Tenant from '#tenant/models/tenant'
import Role from '#role/models/role'
import Permission from '#role/models/permission'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

const USERS_ROUTE = '/api/v1/users'

test.group('Users API', (group) => {
  let adminUser: User
  let regularUser: User
  let testTenant: Tenant
  let adminRole: Role
  let userRole: Role
  let adminToken: string
  let regularToken: string

  group.setup(async () => {
    // Create test tenant
    testTenant = await Tenant.create({
      name: 'Test User Management',
      slug: 'test-user-mgmt',
      domain: 'user-mgmt.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create roles
    adminRole = await Role.create({
      name: 'admin',
      description: 'Administrator',
      tenantId: Number(testTenant.id),
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    userRole = await Role.create({
      name: 'user',
      description: 'Regular User',
      tenantId: testTenant.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create permissions
    const userPermissions = await Permission.createMany([
      {
        name: 'create:users',
        description: 'Create users',
        tenantId: testTenant.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        name: 'read:users',
        description: 'Read users',
        tenantId: testTenant.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        name: 'update:users',
        description: 'Update users',
        tenantId: testTenant.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        name: 'delete:users',
        description: 'Delete users',
        tenantId: testTenant.id,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
    ])

    // Assign permissions to admin role
    await adminRole.related('permissions').attach(userPermissions.map((p) => p.id))

    // Create admin user
    const hashedPassword = await hash.make('password123')
    adminUser = await User.create({
      username: 'useradmin',
      email: 'useradmin@example.com',
      password: hashedPassword,
      firstName: 'User',
      lastName: 'Admin',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create user profile for admin
    await UserProfile.create({
      userId: adminUser.id,
      bio: 'Administrator user',
      avatar: 'https://example.com/admin-avatar.jpg',
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

    // Assign user role
    await regularUser.related('roles').attach([userRole.id])
  })

  group.teardown(async () => {
    // Clean up test data
    await UserProfile.query()
      .whereHas('user', (query) => {
        query.whereIn('id', [adminUser.id, regularUser.id])
      })
      .delete()
    await User.query().whereIn('id', [adminUser.id, regularUser.id]).delete()
    await Permission.query().where('tenant_id', testTenant.id).delete()
    await Role.query().where('tenant_id', testTenant.id).delete()
    await Tenant.query().where('id', testTenant.id).delete()
  })

  group.each.setup(async ({ client }) => {
    // Login admin user
    const adminLogin = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'useradmin@example.com',
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

  test('should create a new user (admin)', async ({ client, assert }) => {
    const userData = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
    }

    const response = await client
      .post(USERS_ROUTE)
      .json(userData)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(201)
    assert.equal(response.body().data.username, userData.username)
    assert.equal(response.body().data.email, userData.email)
    assert.equal(response.body().data.firstName, userData.firstName)
    assert.equal(response.body().data.tenantId, testTenant.id)

    // Cleanup
    await User.query().where('email', userData.email).delete()
  })

  test('should not create user with duplicate email', async ({ client }) => {
    const duplicateUserData = {
      username: 'duplicate',
      email: regularUser.email, // Use existing email
      password: 'password123',
      firstName: 'Duplicate',
      lastName: 'User',
    }

    const response = await client
      .post(USERS_ROUTE)
      .json(duplicateUserData)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should not allow regular user to create users', async ({ client }) => {
    const userData = {
      username: 'unauthorized',
      email: 'unauthorized@example.com',
      password: 'password123',
      firstName: 'Unauthorized',
      lastName: 'User',
    }

    const response = await client
      .post(USERS_ROUTE)
      .json(userData)
      .header('Authorization', `Bearer ${regularToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(403)
  })

  test('should get list of users (admin)', async ({ client, assert }) => {
    const response = await client
      .get(USERS_ROUTE)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.isAbove(response.body().data.length, 0)
  })

  test('should not allow regular user to list all users', async ({ client }) => {
    const response = await client
      .get(USERS_ROUTE)
      .header('Authorization', `Bearer ${regularToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(403)
  })

  test('should get single user details', async ({ client, assert }) => {
    const response = await client
      .get(`${USERS_ROUTE}/${regularUser.id}`)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.id, regularUser.id)
    assert.equal(response.body().data.email, regularUser.email)
    assert.exists(response.body().data.profile)
  })

  test('should update user profile (own profile)', async ({ client, assert }) => {
    const profileData = {
      firstName: 'Updated',
      lastName: 'Name',
      phone: '+9876543210',
      profile: {
        bio: 'Updated bio',
        avatar: 'https://example.com/new-avatar.jpg',
      },
    }

    const response = await client
      .put(`${USERS_ROUTE}/profile`)
      .json(profileData)
      .header('Authorization', `Bearer ${regularToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.firstName, profileData.firstName)
    assert.equal(response.body().data.lastName, profileData.lastName)
  })

  test('should update any user (admin)', async ({ client, assert }) => {
    const updateData = {
      firstName: 'Admin Updated',
      lastName: 'User',
      status: 'inactive',
    }

    const response = await client
      .put(`${USERS_ROUTE}/${regularUser.id}`)
      .json(updateData)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.firstName, updateData.firstName)
    assert.equal(response.body().data.status, updateData.status)
  })

  test('should not allow regular user to update other users', async ({ client }) => {
    const updateData = {
      firstName: 'Unauthorized Update',
    }

    const response = await client
      .put(`${USERS_ROUTE}/${adminUser.id}`)
      .json(updateData)
      .header('Authorization', `Bearer ${regularToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(403)
  })

  test('should delete user (admin)', async ({ client, assert }) => {
    // Create user to delete
    const hashedPassword = await hash.make('password123')
    const userToDelete = await User.create({
      username: 'usertodelete',
      email: 'delete@example.com',
      password: hashedPassword,
      firstName: 'Delete',
      lastName: 'Me',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .delete(`${USERS_ROUTE}/${userToDelete.id}`)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)

    // Verify user is deleted
    const deletedUser = await User.find(userToDelete.id)
    assert.isNull(deletedUser)
  })

  test('should not allow regular user to delete users', async ({ client }) => {
    const response = await client
      .delete(`${USERS_ROUTE}/${adminUser.id}`)
      .header('Authorization', `Bearer ${regularToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(403)
  })

  test('should get users with specific role', async ({ client, assert }) => {
    const response = await client
      .get(`${USERS_ROUTE}/roles`)
      .qs({ role: 'admin' })
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)

    // All returned users should have admin role
    const allAdmins = response
      .body()
      .data.every((user: any) => user.roles.some((role: any) => role.name === 'admin'))
    assert.isTrue(allAdmins)
  })

  test('should not access users from different tenant', async ({ client }) => {
    // Create another tenant and user
    const otherTenant = await Tenant.create({
      name: 'Other Tenant',
      slug: 'other-tenant-user',
      domain: 'other-user.local',
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

    // Try to access other tenant's user
    const response = await client
      .get(`${USERS_ROUTE}/${otherUser.id}`)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)

    // Cleanup
    await User.query().where('id', otherUser.id).delete()
    await Tenant.query().where('id', otherTenant.id).delete()
  })

  test('should filter users by status', async ({ client, assert }) => {
    // Create user with inactive status
    const hashedPassword = await hash.make('password123')
    const inactiveUser = await User.create({
      username: 'inactiveuser',
      email: 'inactive@example.com',
      password: hashedPassword,
      firstName: 'Inactive',
      lastName: 'User',
      tenantId: testTenant.id,
      status: 'inactive',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .get(USERS_ROUTE)
      .qs({ status: 'active' })
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)

    // All returned users should have 'active' status
    const allActive = response.body().data.every((user: any) => user.status === 'active')
    assert.isTrue(allActive)

    // Cleanup
    await User.query().where('id', inactiveUser.id).delete()
  })

  test('should require authentication', async ({ client }) => {
    const response = await client.get(USERS_ROUTE).header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should require valid tenant', async ({ client }) => {
    const response = await client
      .get(USERS_ROUTE)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', 'invalid-tenant')

    response.assertStatus(404)
  })

  test('should validate user creation data', async ({ client }) => {
    const invalidData = {
      username: '', // Empty username
      email: 'invalid-email', // Invalid email format
      password: '123', // Too short password
      firstName: '', // Empty first name
    }

    const response = await client
      .post(USERS_ROUTE)
      .json(invalidData)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should search users by name or email', async ({ client, assert }) => {
    const response = await client
      .get(USERS_ROUTE)
      .qs({ search: 'regular' })
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)

    // Should find the regular user
    const foundUser = response.body().data.find((user: any) => user.username === 'regularuser')
    assert.exists(foundUser)
  })

  test('should handle user profile creation and updates', async ({ client, assert }) => {
    // Create new user first
    const userData = {
      username: 'profiletest',
      email: 'profiletest@example.com',
      password: 'password123',
      firstName: 'Profile',
      lastName: 'Test',
    }

    const createResponse = await client
      .post(USERS_ROUTE)
      .json(userData)
      .header('Authorization', `Bearer ${adminToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    const userId = createResponse.body().data.id

    // Login as the new user to update profile
    const loginResponse = await client
      .post('/api/v1/auth/login')
      .json({
        email: userData.email,
        password: userData.password,
      })
      .header('X-Tenant-Slug', testTenant.slug)

    const userToken = loginResponse.body().token.token

    // Update profile
    const profileData = {
      profile: {
        bio: 'Test user bio',
        avatar: 'https://example.com/avatar.jpg',
        preferences: {
          theme: 'dark',
          notifications: true,
        },
      },
    }

    const profileResponse = await client
      .put(`${USERS_ROUTE}/profile`)
      .json(profileData)
      .header('Authorization', `Bearer ${userToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    profileResponse.assertStatus(200)
    assert.exists(profileResponse.body().data.profile)

    // Cleanup
    await User.query().where('id', userId).delete()
  })
})
