import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'delivery_zones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.json('coordinates').nullable() // GeoJSON polygon coordinates
      table.decimal('delivery_fee', 8, 2).defaultTo(0)
      table.integer('estimated_delivery_time').nullable() // in minutes
      table.boolean('is_active').defaultTo(true)
      table.json('postal_codes').nullable() // Array of postal codes covered

      // TENANT ISOLATION: Delivery zones belong to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Unique constraint: zone name per tenant
      table.unique(['name', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
