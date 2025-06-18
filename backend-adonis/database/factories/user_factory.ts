import Factory from '@adonisjs/lucid/factories'
import User from '#user/models/user'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { RoleFactory } from './role_factory.js'
import { TenantFactory } from './tenant_factory.js'

export const UserFactory = Factory.define(User, async ({ faker }) => {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: await hash.use('scrypt').make('password123'),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    status: 'active' as 'active',
    createdAt: DateTime.local(),
    updatedAt: DateTime.local(),
    lastLoginAt: null,
  }
})
  .relation('roles', () => RoleFactory)
  .relation('tenants', () => TenantFactory)
  .build()
