import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.text('description')
      table.decimal('price', 10, 2).notNullable()
      table.string('sku').notNullable()
      table.boolean('is_active').defaultTo(true)

      // Tenant relationship
      table
        .integer('tenant_id')
        .unsigned()
        .references('id')
        .inTable('tenants')
        .onDelete('CASCADE')
        .notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())

      /****************** Added columns ********************/
      table.boolean('is_marketplace_visible').defaultTo(true)
      table.integer('marketplace_priority').defaultTo(0)
      table.decimal('average_rating', 3, 2).defaultTo(0)

      // Add indexes for marketplace functionality
      table.index(['is_marketplace_visible'])
      table.index(['marketplace_priority'])
      table.index(['average_rating'])
      /*******************************************************/
      // Indexes
      table.unique(['sku', 'tenant_id'])
      table.index(['tenant_id'])
      table.index(['is_active'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
