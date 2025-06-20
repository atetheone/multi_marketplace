import { test } from '@japa/runner'
import User from '#user/models/user'
import Tenant from '#tenant/models/tenant'
import Role from '#role/models/role'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

test.group('Auth API', (group) => {
  let testTenant: Tenant
  let userRole: Role
  let testUser: User

  group.setup(async () => {
    // Create test tenant
    testTenant = await Tenant.create({
      name: 'Test Auth Tenant',
      slug: 'test-auth-tenant',
      domain: 'auth.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create user role
    userRole = await Role.create({
      name: 'user',
      tenantId: testTenant.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test user
    const hashedPassword = await hash.make('password123')
    testUser = await User.create({
      username: 'authtest',
      email: 'authtest@example.com',
      password: hashedPassword,
      firstName: 'Auth',
      lastName: 'Test',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Assign role to user
    await testUser.related('roles').attach([userRole.id])
  })

  group.teardown(async () => {
    // Clean up test data
    await User.query().where('id', testUser.id).delete()
    await Role.query().where('id', userRole.id).delete()
    await Tenant.query().where('id', testTenant.id).delete()
  })

  test('should login with valid credentials', async ({ client, assert }) => {
    const response = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'authtest@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.exists(response.body().token)
    assert.exists(response.body().user)
    assert.equal(response.body().user.email, 'authtest@example.com')
    assert.equal(response.body().user.tenantId, testTenant.id)
  })

  test('should not login with invalid credentials', async ({ client }) => {
    const response = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'authtest@example.com',
        password: 'wrongpassword',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should not login with invalid email format', async ({ client }) => {
    const response = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'invalidemail',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should not login with non-existent user', async ({ client }) => {
    const response = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'nonexistent@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should not login user from different tenant', async ({ client }) => {
    // Create another tenant and user
    const otherTenant = await Tenant.create({
      name: 'Other Tenant',
      slug: 'other-tenant-auth',
      domain: 'other-auth.local',
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

    // Try to login with wrong tenant
    const response = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'otheruser@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug) // Wrong tenant

    response.assertStatus(403)

    // Cleanup
    await User.query().where('id', otherUser.id).delete()
    await Tenant.query().where('id', otherTenant.id).delete()
  })

  test('should not login inactive user', async ({ client }) => {
    // Create inactive user
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
      .post('/api/v1/auth/login')
      .json({
        email: 'inactive@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(403)

    // Cleanup
    await User.query().where('id', inactiveUser.id).delete()
  })

  test('should get current user details', async ({ client, assert }) => {
    // First login to get token
    const loginResponse = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'authtest@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    const token = loginResponse.body().token.token

    const response = await client
      .get('/api/v1/auth/me')
      .header('Authorization', `Bearer ${token}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.email, 'authtest@example.com')
    assert.equal(response.body().data.tenantId, testTenant.id)
    assert.exists(response.body().data.roles)
    assert.equal(response.body().data.roles.length, 1)
    assert.equal(response.body().data.roles[0].name, 'user')
  })

  test('should not get current user without token', async ({ client }) => {
    const response = await client
      .get('/api/v1/auth/me')
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should not get current user with invalid token', async ({ client }) => {
    const response = await client
      .get('/api/v1/auth/me')
      .header('Authorization', 'Bearer invalid-token')
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should logout user', async ({ client }) => {
    // First login to get token
    const loginResponse = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'authtest@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    const token = loginResponse.body().token.token

    const response = await client
      .post('/api/v1/auth/logout')
      .header('Authorization', `Bearer ${token}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)

    // Token should be invalidated - subsequent requests should fail
    const meResponse = await client
      .get('/api/v1/auth/me')
      .header('Authorization', `Bearer ${token}`)
      .header('X-Tenant-Slug', testTenant.slug)

    meResponse.assertStatus(401)
  })

  test('should register new user', async ({ client, assert }) => {
    const userData = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'newpassword123',
      firstName: 'New',
      lastName: 'User',
      tenantId: testTenant.id,
    }

    const response = await client
      .post('/api/v1/auth/register-user')
      .json(userData)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(201)
    assert.equal(response.body().data.email, userData.email)
    assert.equal(response.body().data.username, userData.username)
    assert.equal(response.body().data.tenantId, testTenant.id)

    // Cleanup
    await User.query().where('email', userData.email).delete()
  })

  test('should not register user with duplicate email', async ({ client }) => {
    const userData = {
      username: 'duplicate',
      email: testUser.email, // Use existing email
      password: 'password123',
      firstName: 'Duplicate',
      lastName: 'User',
      tenantId: testTenant.id,
    }

    const response = await client
      .post('/api/v1/auth/register-user')
      .json(userData)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(409)
  })

  test('should not register user with duplicate username', async ({ client }) => {
    const userData = {
      username: testUser.username, // Use existing username
      email: 'duplicate@example.com',
      password: 'password123',
      firstName: 'Duplicate',
      lastName: 'User',
      tenantId: testTenant.id,
    }

    const response = await client
      .post('/api/v1/auth/register-user')
      .json(userData)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(409)
  })

  test('should not register user with invalid data', async ({ client }) => {
    const invalidData = {
      username: '', // Empty username
      email: 'invalid-email', // Invalid email format
      password: '123', // Too short password
      firstName: '',
      lastName: '',
    }

    const response = await client
      .post('/api/v1/auth/register-user')
      .json(invalidData)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should require valid tenant for all auth operations', async ({ client }) => {
    // Test login with invalid tenant
    const loginResponse = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'authtest@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', 'invalid-tenant')

    loginResponse.assertStatus(404)

    // Test register with invalid tenant
    const registerResponse = await client
      .post('/api/v1/auth/register-user')
      .json({
        username: 'test',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      .header('X-Tenant-Slug', 'invalid-tenant')

    registerResponse.assertStatus(404)
  })

  test('should validate password strength', async ({ client }) => {
    const weakPasswordData = {
      username: 'weakuser',
      email: 'weakuser@example.com',
      password: '123', // Too weak
      firstName: 'Weak',
      lastName: 'User',
      tenantId: testTenant.id,
    }

    const response = await client
      .post('/api/v1/auth/register-user')
      .json(weakPasswordData)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(422)
  })

  test('should handle case insensitive email login', async ({ client, assert }) => {
    const response = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'AUTHTEST@EXAMPLE.COM', // Uppercase email
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.exists(response.body().token)
    assert.equal(response.body().user.email, 'authtest@example.com') // Should return lowercase
  })

  test('should include user permissions in auth response', async ({ client, assert }) => {
    // First login to get token
    const loginResponse = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'authtest@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    const token = loginResponse.body().token.token

    const response = await client
      .get('/api/v1/auth/me')
      .header('Authorization', `Bearer ${token}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.exists(response.body().data.roles)
    assert.isArray(response.body().data.roles)
    // Should include role permissions if any
    if (response.body().data.roles.length > 0) {
      assert.exists(response.body().data.roles[0].permissions)
    }
  })
})