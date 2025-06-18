import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('id').inTable('users').nullable()

      table
        .integer('tenant_id')
        .unsigned()
        .references('id')
        .inTable('tenants')
        .onDelete('CASCADE')
        .notNullable()

      table.string('payment_method')

      table.decimal('subtotal', 10, 2).notNullable() // new change
      table.decimal('delivery_fee', 10, 2).notNullable() // New change
      table.decimal('total', 10, 2).notNullable()

      // Shipping info
      table.integer('address_id').unsigned().references('id').inTable('addresses').nullable()

      // Status
      table
        .enum('status', ['pending', 'processing', 'picked', 'delivered', 'cancelled', 'returned'])
        .defaultTo('pending')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Indexes
      table.index(['user_id'])
      table.index(['tenant_id'])
      table.index(['status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
