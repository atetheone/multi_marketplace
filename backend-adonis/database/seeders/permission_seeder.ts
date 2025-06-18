import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#role/models/permission'

export default class PermissionSeeder extends BaseSeeder {
  async run() {
    const permissions = [
      { resource: 'tenants', action: 'create' },
      { resource: 'tenants', action: 'read' },
      { resource: 'tenants', action: 'update' },
      { resource: 'tenants', action: 'delete' },
      { resource: 'products', action: 'create' },
      { resource: 'products', action: 'read' },
      { resource: 'products', action: 'update' },
      { resource: 'products', action: 'delete' },
      { resource: 'orders', action: 'create' },
      { resource: 'orders', action: 'read' },
      { resource: 'orders', action: 'update' },
      { resource: 'orders', action: 'delete' },
      { resource: 'users', action: 'create' },
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
      { resource: 'users', action: 'delete' },
      { resource: 'roles', action: 'create' },
      { resource: 'roles', action: 'read' },
      { resource: 'roles', action: 'update' },
      { resource: 'roles', action: 'delete' },
      { resource: 'permissions', action: 'create' },
      { resource: 'permissions', action: 'read' },
      { resource: 'permissions', action: 'update' },
      { resource: 'permissions', action: 'delete' },
      { resource: 'dashboard', action: 'read' },
      { action: 'create', resource: 'products' },
      { action: 'read', resource: 'products' },
      { action: 'update', resource: 'products' },
      { action: 'delete', resource: 'products' },
    ]

    await Permission.createMany(permissions)
  }
}
