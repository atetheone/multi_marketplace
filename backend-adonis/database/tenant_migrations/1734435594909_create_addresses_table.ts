import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('type').defaultTo('shipping') // 'shipping', 'billing'
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('company').nullable()
      table.string('address_line_1').notNullable()
      table.string('address_line_2').nullable()
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.string('postal_code').notNullable()
      table.string('country').notNullable()
      table.string('phone').nullable()
      table.text('instructions').nullable()
      table.boolean('is_default').defaultTo(false)
      table.integer('zone_id').unsigned().nullable()
      
      // TENANT ISOLATION: Addresses belong to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')
      
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('zone_id').references('id').inTable('delivery_zones').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}