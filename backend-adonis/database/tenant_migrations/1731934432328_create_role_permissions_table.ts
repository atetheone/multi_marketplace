import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'role_permission'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('role_id').unsigned().notNullable()
      table.integer('permission_id').unsigned().notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE')
      table.foreign('permission_id').references('id').inTable('permissions').onDelete('CASCADE')

      // Unique constraint: role-permission combination
      table.unique(['role_id', 'permission_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
