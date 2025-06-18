// database/migrations/[timestamp]_create_menu_items_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menu_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('label').notNullable()
      table.string('route').nullable()
      table.string('icon').nullable()
      table
        .integer('parent_id')
        .unsigned()
        .references('id')
        .inTable('menu_items')
        .onDelete('CASCADE')
        .nullable()

      table.integer('tenant_id').unsigned().references('id').inTable('tenants').onDelete('SET NULL')

      table.integer('order').notNullable().defaultTo(0)
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_internal').defaultTo(true)
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
