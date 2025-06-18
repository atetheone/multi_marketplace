import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#user/models/user'
import Role from '#role/models/role'
import hash from '@adonisjs/core/services/hash'
import { UserFactory } from '#database/factories/user_factory'

export default class UserSeeder extends BaseSeeder {
  async run() {
    // Get existing roles
    const roles = await Role.query()

    // Create 10 random users using the factory
    const users = await UserFactory.with('tenants', 1).createMany(10)

    // Attach each user to the default tenant and assign roles
    await Promise.all(
      users.map(async (user, index) => {
        // Attach user to default tenant
        await user.related('tenants').attach([1])

        // Assign roles based on index
        if (index === 0) {
          // First user gets admin role
          const adminRole = roles.find((role) => role.name === 'super-admin')
          if (adminRole) {
            await user.related('roles').attach([adminRole.id])
          }
        } else if (index === 1) {
          // Second user gets manager role
          const managerRole = roles.find((role) => role.name === 'manager')
          if (managerRole) {
            await user.related('roles').attach([managerRole.id])
          }
        } else {
          // Rest get user role
          const userRole = roles.find((role) => role.name === 'user')
          if (userRole) {
            await user.related('roles').attach([userRole.id])
          }
        }

        // Load roles for return value
        await user.load('roles', (rolesQuery) => {
          rolesQuery.preload('permissions')
        })
      })
    )
  }
}
