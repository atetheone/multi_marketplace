import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('order_id').unsigned().notNullable()
      table.integer('product_id').unsigned().notNullable()
      table.string('product_name').notNullable() // Historical product name
      table.string('product_sku').notNullable() // Historical SKU
      table.decimal('unit_price', 10, 2).notNullable() // Historical price
      table.integer('quantity').notNullable()
      table.decimal('total_price', 10, 2).notNullable()
      table.json('product_options').nullable() // e.g., size, color
      table.json('meta_data').nullable()
      
      // TENANT ISOLATION: Order items belong to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')
      
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE')
      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}