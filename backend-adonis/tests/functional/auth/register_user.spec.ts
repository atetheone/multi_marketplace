import { test } from '@japa/runner'
import User from '#user/models/user'
import Role from '#role/models/role'

const REGISTER_ROUTE = '/api/v1/auth/register-user'

test.group('Auth Register', (group) => {
  group.setup(async () => {
    // Create roles for testing
    await Role.createMany([{ name: 'user' }, { name: 'admin' }])
  })

  group.teardown(async () => {
    // Clean up the test users and roles
    await User.query().where('email', 'testuser@example.com').delete()
    await Role.query().whereIn('name', ['user', 'admin']).delete()
  })

  test('should register a user with valid data', async ({ client, assert }) => {
    const response = await client.post(REGISTER_ROUTE).json({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      tenantId: 1,
      roles: [1], // Assuming role ID 1 is 'user'
    })

    response.assertStatus(201)
    assert.exists(response.body().data, 'User should be created')
    assert.equal(response.body().data.email, 'testuser@example.com')
  })

  test('should not register a user with an existing username', async ({ client, assert }) => {
    // Create a user with the same username
    await User.create({
      username: 'testuser',
      email: 'existinguser@example.com',
      firstName: 'Existing',
      lastName: 'User',
      tenantId: 1,
    })

    const response = await client.post(REGISTER_ROUTE).json({
      username: 'testuser',
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      tenantId: 1,
      roles: [1], // Assuming role ID 1 is 'user'
    })

    response.assertStatus(409)
    assert.equal(response.body().message, 'Username already taken')
  })

  test('should not register a user with an existing email', async ({ client, assert }) => {
    // Create a user with the same email
    await User.create({
      username: 'existinguser',
      email: 'testuser@example.com',
      firstName: 'Existing',
      lastName: 'User',
      tenantId: 1,
    })

    const response = await client.post(REGISTER_ROUTE).json({
      username: 'newuser',
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      tenantId: 1,
      roles: [3], // role ID 3 is 'user'
    })

    response.assertStatus(409)
    assert.equal(response.body().message, 'Email already taken')
  })

  test('should not register a user with invalid data', async ({
    /*client, assert*/
  }) => {
    // TO DO
    // response.assertStatus(422)
  })
})
