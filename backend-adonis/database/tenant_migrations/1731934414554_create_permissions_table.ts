import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('resource_id').unsigned().notNullable()
      table.string('action').notNullable() // 'create', 'read', 'update', 'delete', etc.
      table.string('name').notNullable() // 'products:create', 'orders:read', etc.
      table.string('description').nullable()
      table.boolean('is_active').defaultTo(true)
      table.string('scope').nullable() // 'own', 'tenant', 'global'

      // TENANT ISOLATION: Permissions can be global (null) or tenant-specific
      table.integer('tenant_id').unsigned().nullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')
      table.foreign('resource_id').references('id').inTable('resources').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Unique constraint: permission name per tenant
      table.unique(['name', 'tenant_id'])
      // Also ensure resource+action combination is unique per tenant
      table.unique(['resource_id', 'action', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
