import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inventory'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('product_id').unsigned().notNullable()
      table.integer('quantity_on_hand').defaultTo(0)
      table.integer('quantity_reserved').defaultTo(0)
      table.integer('quantity_available').defaultTo(0)
      table.integer('reorder_point').defaultTo(10)
      table.integer('reorder_quantity').defaultTo(50)
      table.decimal('cost_per_unit', 10, 2).nullable()
      table.string('location').nullable() // Warehouse location, bin, etc.
      table.timestamp('last_counted_at').nullable()
      table.text('notes').nullable()

      // TENANT ISOLATION: Inventory belongs to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')

      // Unique constraint: one inventory record per product per tenant
      table.unique(['product_id', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
