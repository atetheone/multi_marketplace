import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.text('description').nullable()
      table.string('image').nullable()
      table.integer('parent_id').unsigned().nullable()
      table.boolean('is_active').defaultTo(true)
      table.integer('sort_order').defaultTo(0)
      table.json('meta_data').nullable()

      // TENANT ISOLATION: Categories belong to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('parent_id').references('id').inTable('categories').onDelete('SET NULL')

      // Unique constraint: slug per tenant
      table.unique(['slug', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
