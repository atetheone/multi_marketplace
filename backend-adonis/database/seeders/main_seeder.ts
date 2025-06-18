import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TenantSeeder from '#database/seeders/tenant_seeder'
import RoleSeeder from '#database/seeders/role_seeder'
import PermissionSeeder from '#database/seeders/permission_seeder'
import UserSeeder from '#database/seeders/user_seeder'
import MenuItemSeeder from '#database/seeders/menu_item_seeder'
import ProductSeeder from '#database/seeders/product_seeder'

export default class extends BaseSeeder {
  private async runSeeder(Seeder: typeof BaseSeeder) {
    await new Seeder(this.client).run()
  }

  async run() {
    await this.runSeeder(PermissionSeeder)
    await this.runSeeder(TenantSeeder)
    await this.runSeeder(RoleSeeder)
    await this.runSeeder(UserSeeder)
    await this.runSeeder(MenuItemSeeder)
    await this.runSeeder(ProductSeeder)
  }
}
