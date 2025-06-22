import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_tenants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.integer('tenant_id').unsigned().notNullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamp('joined_at').defaultTo(this.now())
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')

      // Unique constraint: user can only be associated once with a tenant
      table.unique(['user_id', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
