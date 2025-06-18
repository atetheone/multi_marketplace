import Factory from '@adonisjs/lucid/factories'
import ProductImage from '#product/models/product_image'

export const ProductImageFactory = Factory.define(ProductImage, ({ faker }) => {
  return {
    url: faker.image.url(),
    filename: `${faker.string.uuid()}.jpg`,
    altText: faker.commerce.productDescription(),
    isCover: false,
    displayOrder: faker.number.int({ min: 0, max: 10 }),
  }
}).build()
