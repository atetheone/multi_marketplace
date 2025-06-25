import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inventory'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('tenant_id')
        .unsigned()
        .references('id')
        .inTable('tenants')
        .onDelete('CASCADE')
        .notNullable()

      table.integer('quantity').unsigned().defaultTo(0)
      table.integer('reservedQuantity').unsigned().defaultTo(0)
      table.integer('reorder_point').unsigned().defaultTo(0)
      table.integer('reorder_quantity').unsigned().defaultTo(0)
      table.integer('low_stock_threshold').unsigned().defaultTo(0)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Add indexes
      table.index(['product_id'])
      table.index(['tenant_id'])
      table.unique(['product_id', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
