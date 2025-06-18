import Factory from '@adonisjs/lucid/factories'
import Product from '#product/models/product'
import { ProductImageFactory } from './product_image_factory.js'
import { CategoryFactory } from './category_factory.js'

export const ProductFactory = Factory.define(Product, ({ faker }) => {
  const price = Number.parseFloat(faker.commerce.price())

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price,
    sku: faker.string.alphanumeric(8).toUpperCase(),
    isActive: true,
    isMarketplaceVisible: true,
    averageRating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
    marketplacePriority: faker.number.int({ min: 1, max: 100 }),
  }
})
  .relation('images', () => ProductImageFactory) // Add images relationship
  .relation('categories', () => CategoryFactory)
  .build()
