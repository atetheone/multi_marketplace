import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tenants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Tenant information
      table.string('slug').notNullable().unique()
      table.string('name').notNullable()
      table.string('domain').notNullable().unique()
      table.string('description')
      // Tenant status
      table
        .enum('status', ['active', 'inactive', 'suspended', 'pending'])
        .defaultTo('pending')
        .notNullable()

      // added after
      table.decimal('rating', 2, 1).defaultTo(0)
      table.string('logo').nullable()
      table.string('cover_image').nullable()
      table.integer('product_count').defaultTo(0)
      table.boolean('is_featured').defaultTo(false)

      // Tenant settings
      // table.json('settings').nullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())

      // Indexes
      table.index(['domain'])
      table.index(['status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
