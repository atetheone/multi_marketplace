// database/migrations/1734434417062_create_addresses_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Address information
      table.enum('type', ['shipping', 'billing']).notNullable().defaultTo('shipping') // e.g., 'shipping', 'billing'
      table.string('address_line1').notNullable()
      table.string('address_line2')
      table.string('city').notNullable()
      table.string('state')
      table.string('country').notNullable()
      table.string('postal_code')
      table.string('phone')
      table.boolean('is_default').defaultTo(false)

      // Tenant relationship for multi-tenancy
      table
        .integer('tenant_id')
        .unsigned()
        .references('id')
        .inTable('tenants')
        .onDelete('CASCADE')
        .notNullable()

      table.integer('zone_id').unsigned().references('id').inTable('delivery_zones')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
