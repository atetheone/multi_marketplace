import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deliveries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('delivery_person_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table.text('notes').nullable()

      table.timestamp('assigned_at', { useTz: true }).nullable()
      table.timestamp('picked_at', { useTz: true }).nullable()
      table.timestamp('delivered_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      // Indexes
      table.index(['order_id'])
      table.index(['delivery_person_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
