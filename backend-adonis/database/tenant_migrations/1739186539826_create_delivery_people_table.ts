import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'delivery_persons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_available').defaultTo(true)
      table.timestamp('last_active_at').nullable()
      table.timestamp('last_delivery_at').nullable()
      table.enum('vehicle_type', ['motorcycle', 'bicycle', 'car', 'van']).notNullable()
      table.string('vehicle_plate_number').notNullable()
      table.string('vehicle_model').nullable()
      table.integer('vehicle_year').nullable()
      table.string('license_number').notNullable()
      table.date('license_expiry').notNullable()
      table.string('license_type').notNullable()
      table.integer('total_deliveries').defaultTo(0)
      table.integer('completed_deliveries').defaultTo(0)
      table.integer('returned_deliveries').defaultTo(0)
      table.integer('average_delivery_time').defaultTo(0) // in minutes
      table.decimal('rating', 3, 2).defaultTo(0)
      table.integer('total_reviews').defaultTo(0)
      table.text('notes').nullable()
      table.timestamp('verified_at').nullable()
      table.integer('verified_by').unsigned().nullable()
      
      // TENANT ISOLATION: Delivery persons belong to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')
      
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('verified_by').references('id').inTable('users').onDelete('SET NULL')
      
      // Unique constraint: user can only be delivery person once per tenant
      table.unique(['user_id', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}