import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.string('type').notNullable() // 'order_status', 'delivery_assigned', etc.
      table.string('title').notNullable()
      table.text('message').notNullable()
      table.json('data').nullable() // Additional notification data
      table.boolean('is_read').defaultTo(false)
      table.timestamp('read_at').nullable()
      table.enum('priority', ['low', 'medium', 'high']).defaultTo('medium')
      table.enum('channel', ['in_app', 'email', 'sms', 'push']).defaultTo('in_app')

      // TENANT ISOLATION: Notifications belong to a tenant
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
