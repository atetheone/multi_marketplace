import { BaseSeeder } from '@adonisjs/lucid/seeders'

import { ProductFactory } from '#database/factories/product_factory'
import { CategoryFactory } from '#database/factories/category_factory'

import Tenant from '#tenant/models/tenant'
import { faker } from '@faker-js/faker'

export default class ProductSeeder extends BaseSeeder {
  async run() {
    const tenants = await Tenant.query().where('status', 'active')

    for (const tenant of tenants) {
      const categories = this.getCategoriesForTenant(tenant.slug)
      const createdCategories = await CategoryFactory.merge(
        categories.map((cat) => ({
          ...cat,
          tenantId: tenant.id,
        }))
      ).createMany(categories.length)

      for (const category of createdCategories) {
        const productsCount = faker.number.int({ min: 5, max: 15 })

        // Create products with images and categories
        await ProductFactory.with('images', 3, (image, index) => {
          image.merge({ isCover: index === 0 })
        })
          .merge({
            tenantId: tenant.id,
            isMarketplaceVisible: true,
            marketplacePriority: faker.number.int({ min: 1, max: 100 }),
          })
          .createMany(productsCount)
          .then(async (products) => {
            for (const product of products) {
              await product.related('categories').attach(category.id)
              // Create inventory
              await product.related('inventory').create({
                quantity: faker.number.int({ min: 0, max: 100 }),
                reorderPoint: faker.number.int({ min: 5, max: 15 }),
                reorderQuantity: faker.number.int({ min: 10, max: 30 }),
                lowStockThreshold: faker.number.int({ min: 3, max: 8 }),
                tenant_id: tenant.id,
              })
            }
          })
      }
    }
  }

  private getCategoriesForTenant(tenantSlug: string) {
    const categoryMap = {
      'electronics-hub': [
        { name: 'Smartphones', icon: 'smartphone' },
        { name: 'Laptops', icon: 'laptop' },
        { name: 'Audio', icon: 'headphones' },
        { name: 'Accessories', icon: 'devices_other' },
      ],
      'fashion-square': [
        { name: "Men's Wear", icon: 'man' },
        { name: "Women's Wear", icon: 'woman' },
        { name: 'Accessories', icon: 'watch' },
        { name: 'Shoes', icon: 'accessibility' },
      ],
      'home-living': [
        { name: 'Furniture', icon: 'chair' },
        { name: 'Decor', icon: 'decoration' },
        { name: 'Kitchen', icon: 'kitchen' },
        { name: 'Lighting', icon: 'light' },
      ],
      'sports-center': [
        { name: 'Fitness', icon: 'fitness_center' },
        { name: 'Team Sports', icon: 'sports_soccer' },
        { name: 'Outdoor', icon: 'terrain' },
        { name: 'Equipment', icon: 'sports' },
      ],
    }

    return categoryMap[tenantSlug as keyof typeof categoryMap] || []
  }
}
