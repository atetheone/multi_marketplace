import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'carts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().nullable() // null for guest carts
      table.string('session_id').nullable() // for guest cart tracking
      table.enum('status', ['active', 'abandoned', 'converted']).defaultTo('active')
      table.timestamp('last_activity_at').defaultTo(this.now())
      table.json('meta_data').nullable()
      
      // TENANT ISOLATION: Carts belong to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')
      
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}