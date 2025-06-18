import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'role_permission'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('permission_id')
        .unsigned()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')
        .notNullable()

      table.unique(['role_id', 'permission_id'])
      table.index(['role_id'])
      table.index(['permission_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
