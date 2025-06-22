import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tenants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('slug').unique().notNullable()
      table.string('domain').unique().nullable()
      table.string('logo').nullable()
      table.text('description').nullable()
      table.boolean('is_active').defaultTo(true)
      table.string('contact_email').nullable()
      table.string('contact_phone').nullable()
      table.json('settings').nullable()
      table.json('branding').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
