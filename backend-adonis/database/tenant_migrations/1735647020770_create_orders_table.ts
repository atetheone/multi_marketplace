import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('order_number').notNullable().unique()
      table.integer('user_id').unsigned().nullable() // null for guest orders
      table.enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).defaultTo('pending')
      table.decimal('subtotal', 10, 2).notNullable()
      table.decimal('tax_amount', 10, 2).defaultTo(0)
      table.decimal('shipping_amount', 10, 2).defaultTo(0)
      table.decimal('discount_amount', 10, 2).defaultTo(0)
      table.decimal('total_amount', 10, 2).notNullable()
      table.string('currency', 3).defaultTo('USD')
      table.text('notes').nullable()
      table.json('meta_data').nullable()
      
      // Shipping Address (embedded for historical purposes)
      table.integer('shipping_address_id').unsigned().nullable()
      table.string('shipping_first_name').nullable()
      table.string('shipping_last_name').nullable()
      table.string('shipping_company').nullable()
      table.string('shipping_address_line_1').nullable()
      table.string('shipping_address_line_2').nullable()
      table.string('shipping_city').nullable()
      table.string('shipping_state').nullable()
      table.string('shipping_postal_code').nullable()
      table.string('shipping_country').nullable()
      table.string('shipping_phone').nullable()
      
      // Billing Address (embedded for historical purposes)
      table.integer('billing_address_id').unsigned().nullable()
      table.string('billing_first_name').nullable()
      table.string('billing_last_name').nullable()
      table.string('billing_company').nullable()
      table.string('billing_address_line_1').nullable()
      table.string('billing_address_line_2').nullable()
      table.string('billing_city').nullable()
      table.string('billing_state').nullable()
      table.string('billing_postal_code').nullable()
      table.string('billing_country').nullable()
      table.string('billing_phone').nullable()
      
      // TENANT ISOLATION: Orders belong to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')
      
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')
      table.foreign('shipping_address_id').references('id').inTable('addresses').onDelete('SET NULL')
      table.foreign('billing_address_id').references('id').inTable('addresses').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}