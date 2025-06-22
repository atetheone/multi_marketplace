import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.integer('role_id').unsigned().notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE')

      // Unique constraint: user-role combination
      table.unique(['user_id', 'role_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
