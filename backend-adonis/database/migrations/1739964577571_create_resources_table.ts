import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'resources'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Resource information
      table.string('name').notNullable()
      table.text('description')
      table.boolean('is_active').notNullable().defaultTo(true)
      table
        .json('available_actions')
        .notNullable()
        .defaultTo(JSON.stringify(['create', 'read', 'update', 'delete']))

      table
        .integer('tenant_id')
        .unsigned()
        .references('id')
        .inTable('tenants')
        .onDelete('CASCADE')
        .nullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      // Indexes
      table.index(['tenant_id'])
      table.index(['is_active'])

      // Ensure resource names are unique per tenant
      table.unique(['name', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
