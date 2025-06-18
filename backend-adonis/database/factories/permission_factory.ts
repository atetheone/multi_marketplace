import Factory from '@adonisjs/lucid/factories'
import Permission from '#role/models/permission'

export const PermissionFactory = Factory.define(Permission, ({ faker }) => {
  const resources = ['tenants', 'products', 'orders', 'users', 'roles', 'permissions']
  const actions = ['create', 'read', 'update', 'delete']

  return {
    resource: faker.helpers.arrayElement(resources),
    action: faker.helpers.arrayElement(actions),
    tenantId: null, // For global permissions
  }
}).build()
