import { test } from '@japa/runner'
import User from '#user/models/user'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

const LOGIN_ROUTE = '/api/v1/auth/login'

test.group('Auth Login', (group) => {
  group.setup(async () => {
    // Create a test user
    const hashedPassword = await hash.make('password123')
    await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      tenantId: 1, // Assuming default tenant has ID 1
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })
  })

  group.teardown(async () => {
    // Clean up the test user
    await User.query().where('email', 'testuser@example.com').delete()
  })

  test('should login with valid credentials', async ({ client, assert }) => {
    const response = await client.post(LOGIN_ROUTE).json({
      email: 'testuser@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    assert.exists(response.body().token, 'Token should exist')
    assert.exists(response.body().user, 'User should exist')
    assert.equal(response.body().user.email, 'testuser@example.com')
  })

  test('should not login with invalid credentials', async ({ client }) => {
    const response = await client.post(LOGIN_ROUTE).json({
      email: 'testuser@example.com',
      password: 'wrongpassword',
    })

    response.assertStatus(401)
    assert.equal(response.body().message, 'Invalid credentials')
  })

  test('should not login with invalid email', async ({ client, assert }) => {
    const response = await client.post(LOGIN_ROUTE).json({
      email: 'testuserrt',
      password: 'zrerrer',
    })

    response.assertStatus(422)
  })
})
