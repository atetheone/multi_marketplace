import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deliveries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('order_id').unsigned().notNullable()
      table.integer('delivery_person_id').unsigned().notNullable()
      table
        .enum('status', [
          'pending',
          'assigned',
          'picked_up',
          'in_transit',
          'delivered',
          'failed',
          'returned',
        ])
        .defaultTo('assigned')
      table.timestamp('assigned_at').nullable()
      table.timestamp('picked_up_at').nullable()
      table.timestamp('delivered_at').nullable()
      table.timestamp('estimated_delivery_time').nullable()
      table.text('notes').nullable()
      table.text('delivery_notes').nullable() // Notes from delivery person
      table.json('tracking_data').nullable() // GPS coordinates, timestamps, etc.
      table.string('proof_of_delivery').nullable() // Image URL or signature
      table.text('failure_reason').nullable()

      // TENANT ISOLATION: Deliveries belong to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE')
      table
        .foreign('delivery_person_id')
        .references('id')
        .inTable('delivery_persons')
        .onDelete('CASCADE')

      // Unique constraint: one delivery per order
      table.unique(['order_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
