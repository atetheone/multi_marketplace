import Factory from '@adonisjs/lucid/factories'
import Role from '#role/models/role'
import { PermissionFactory } from './permission_factory.js'

export const RoleFactory = Factory.define(Role, ({ faker }) => {
  return {
    name: faker.helpers.arrayElement(['admin', 'user', 'manager']),
    tenantId: null,
  }
})
  .relation('permissions', () => PermissionFactory)
  .build()
