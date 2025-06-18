import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Image information
      table.string('url').notNullable()
      table.string('filename').notNullable()
      table.string('alt_text')
      table.boolean('is_cover').defaultTo(false)
      table.integer('display_order').defaultTo(0)

      // Product relationship
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .notNullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())

      // Indexes
      table.index(['product_id'])
      table.index(['is_cover'])
      table.index(['display_order'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}