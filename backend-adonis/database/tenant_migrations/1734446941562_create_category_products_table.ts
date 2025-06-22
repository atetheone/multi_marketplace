import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'category_products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('category_id').unsigned().notNullable()
      table.integer('product_id').unsigned().notNullable()
      table.integer('sort_order').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE')
      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
      
      // Unique constraint: product-category combination
      table.unique(['category_id', 'product_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}