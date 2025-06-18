import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tenant from '#tenant/models/tenant'
import Role from '#role/models/role'
import User from '#user/models/user'
import hash from '@adonisjs/core/services/hash'

export default class TenantSeeder extends BaseSeeder {
  async run() {
    const tenants = [
      {
        slug: 'default',
        name: 'Default tenant',
        domain: 'default.market.com',
        description: 'The marketplace that you should know',
        status: 'active',
        rating: 5.0,
      },
      {
        slug: 'electronics-hub',
        name: 'Electronics Hub',
        domain: 'electronics.marketplace.com',
        description: 'Latest electronics and gadgets',
        status: 'active',
        rating: 4.5,
        coverImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03',
        logo: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
      },
      {
        slug: 'fashion-square',
        name: 'Fashion Square',
        domain: 'fashion.marketplace.com',
        description: 'Trendy fashion and accessories',
        status: 'active',
        rating: 4.7,
        coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
        logo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
      },
      {
        slug: 'home-living',
        name: 'Home & Living',
        domain: 'home.marketplace.com',
        description: 'Everything for your home',
        status: 'active',
        rating: 4.3,
        coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
        logo: 'https://images.unsplash.com/photo-1484154218962-a197022b5858',
      },
      {
        slug: 'sports-center',
        name: 'Sports Center',
        domain: 'sports.marketplace.com',
        description: 'Sports gear and equipment',
        status: 'active',
        rating: 4.6,
        coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
        logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b',
      },
    ]

    for (const tenantData of tenants) {
      const tenant = await Tenant.create(tenantData)

      // Create admin user for each tenant
      const hashedPassword = await hash.use('scrypt').make('tenant123')
      const adminUser = await User.create({
        username: `admin_${tenant.slug}`,
        email: `admin@${tenant.domain}`,
        password: hashedPassword,
        firstName: 'Store',
        lastName: 'Admin',
        status: 'active',
      })

      // Attach admin role
      const adminRole = await Role.findBy('name', 'admin')
      if (adminRole) {
        await adminUser.related('roles').attach([adminRole.id])
      }
    }
  }
}
