import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'resources'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable() // e.g., 'products', 'orders'
      table.string('description').nullable()
      table.boolean('is_active').defaultTo(true)
      table.json('available_actions').notNullable().defaultTo('[]') // e.g., ['create', 'read', 'update', 'delete']

      // TENANT ISOLATION: Resources can be global (null) or tenant-specific
      table.integer('tenant_id').unsigned().nullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Unique constraint: resource name per tenant
      table.unique(['name', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
