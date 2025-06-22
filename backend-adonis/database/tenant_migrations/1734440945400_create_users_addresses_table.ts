import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users_addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.integer('address_id').unsigned().notNullable()
      table.enum('type', ['shipping', 'billing']).notNullable()
      table.boolean('is_default').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('address_id').references('id').inTable('addresses').onDelete('CASCADE')
      
      // Unique constraint: user-address-type combination
      table.unique(['user_id', 'address_id', 'type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}