import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'delivery_persons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Link to users table
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
        .unique()

      // Tenant relationship
      table
        .integer('tenant_id')
        .unsigned()
        .references('id')
        .inTable('tenants')
        .onDelete('CASCADE')
        .notNullable()

      // Status and Availability
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_available').defaultTo(true)
      table.timestamp('last_active_at').nullable()
      table.timestamp('last_delivery_at').nullable()

      // Vehicle Information
      table.enum('vehicle_type', ['motorcycle', 'bicycle', 'car', 'van']).notNullable()
      table.string('vehicle_plate_number').notNullable()
      table.string('vehicle_model').nullable()
      table.integer('vehicle_year').nullable()

      // License Information
      table.string('license_number').notNullable()
      table.date('license_expiry').notNullable()
      table.string('license_type').nullable() // e.g., A, B, etc.

      // Performance Metrics
      table.integer('total_deliveries').nullable()
      table.integer('completed_deliveries').defaultTo(0)
      table.integer('returned_deliveries').defaultTo(0)
      table.decimal('average_delivery_time', 10, 2).nullable()
      table.decimal('rating', 3, 2).nullable()
      table.integer('total_reviews').defaultTo(0)

      // Additional Information
      table.text('notes').nullable()

      // System columns
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('verified_at').nullable()

      // Indexes
      table.index(['tenant_id'])
      table.index(['is_active'])
      table.index(['is_available'])
      table.index(['rating'])
      table.index(['vehicle_type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
