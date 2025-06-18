import Factory from '@adonisjs/lucid/factories'
import Category from '#product/models/category'

export const CategoryFactory = Factory.define(Category, ({ faker }) => {
  const name = `${faker.commerce.department()} ${faker.number.int({ min: 1000, max: 9999 })}`

  return {
    name,
    description: faker.commerce.productDescription(),
    parentId: null,
  }
}).build()
