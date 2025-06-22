import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.timestamp('email_verified_at').nullable()
      table.string('password').notNullable()
      table.string('remember_me_token').nullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamp('last_login_at').nullable()

      // TENANT ISOLATION: Every user belongs to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Unique constraint: email + tenant_id (allows same email across tenants)
      table.unique(['email', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
