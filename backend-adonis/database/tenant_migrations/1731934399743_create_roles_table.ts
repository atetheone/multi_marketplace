import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('description').nullable()
      table.boolean('is_active').defaultTo(true)

      // TENANT ISOLATION: Roles can be global (null) or tenant-specific
      table.integer('tenant_id').unsigned().nullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Unique constraint: role name per tenant (global roles have null tenant_id)
      table.unique(['name', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
