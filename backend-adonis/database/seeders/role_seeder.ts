import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#role/models/role'
import Permission from '#role/models/permission'

export default class RoleSeeder extends BaseSeeder {
  async run() {
    const roles = [
      { name: 'super-admin' },
      { name: 'admin' },
      { name: 'user' },
      { name: 'manager' },
    ]

    await Role.createMany(roles)

    // Assign permissions to roles
    const superAdminRole = await Role.query().where('name', 'super-admin').firstOrFail()
    const adminRole = await Role.query().where('name', 'admin').firstOrFail()
    const userRole = await Role.query().where('name', 'user').firstOrFail()
    const managerRole = await Role.query().where('name', 'manager').firstOrFail()

    // Fetch existing permissions
    const permissions = await Permission.query().whereNull('tenantId')

    await superAdminRole.related('permissions').attach(permissions.map((p) => p.id))
    await adminRole
      .related('permissions')
      .attach(permissions.filter((p) => p.action === 'read').map((p) => p.id))
    await userRole
      .related('permissions')
      .attach(permissions.filter((p) => p.action === 'read').map((p) => p.id))
    await managerRole
      .related('permissions')
      .attach(permissions.filter((p) => p.action === 'read').map((p) => p.id))
  }
}
