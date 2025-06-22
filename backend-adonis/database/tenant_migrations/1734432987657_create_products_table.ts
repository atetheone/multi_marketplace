import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.text('description').nullable()
      table.text('short_description').nullable()
      table.string('sku').notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.decimal('compare_price', 10, 2).nullable()
      table.decimal('cost_price', 10, 2).nullable()
      table.boolean('track_inventory').defaultTo(true)
      table.integer('inventory_quantity').defaultTo(0)
      table.integer('low_stock_threshold').defaultTo(10)
      table.decimal('weight', 8, 2).nullable()
      table.json('dimensions').nullable() // {length, width, height}
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_featured').defaultTo(false)
      table.boolean('requires_shipping').defaultTo(true)
      table.json('meta_data').nullable()
      table.json('attributes').nullable()

      // TENANT ISOLATION: Products belong to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Unique constraint: SKU per tenant
      table.unique(['sku', 'tenant_id'])
      // Unique constraint: slug per tenant
      table.unique(['slug', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
