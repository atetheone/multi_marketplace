import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('order_id').unsigned().notNullable()
      table.string('payment_method').notNullable() // 'credit_card', 'paypal', 'stripe', etc.
      table.string('payment_gateway').notNullable() // 'stripe', 'paypal', 'square', etc.
      table.string('transaction_id').nullable()
      table.string('gateway_transaction_id').nullable()
      table.enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']).defaultTo('pending')
      table.decimal('amount', 10, 2).notNullable()
      table.string('currency', 3).defaultTo('USD')
      table.decimal('gateway_fee', 10, 2).defaultTo(0)
      table.json('gateway_response').nullable()
      table.timestamp('processed_at').nullable()
      table.text('failure_reason').nullable()
      table.text('notes').nullable()
      
      // TENANT ISOLATION: Payments belong to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')
      
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}