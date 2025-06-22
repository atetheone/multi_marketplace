import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('cart_id').unsigned().notNullable()
      table.integer('product_id').unsigned().notNullable()
      table.integer('quantity').notNullable().defaultTo(1)
      table.decimal('unit_price', 10, 2).notNullable()
      table.json('product_options').nullable() // e.g., size, color
      table.timestamp('added_at').defaultTo(this.now())
      
      // TENANT ISOLATION: Cart items belong to a tenant
      table.integer('tenant_id').unsigned().notNullable()
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')
      
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('cart_id').references('id').inTable('carts').onDelete('CASCADE')
      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
      
      // Unique constraint: product can only be in cart once (update quantity instead)
      table.unique(['cart_id', 'product_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}