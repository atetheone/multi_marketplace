import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable().unique()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('phone').nullable()
      table.date('date_of_birth').nullable()
      table.enum('gender', ['male', 'female', 'other']).nullable()
      table.string('avatar').nullable()
      table.text('bio').nullable()
      table.string('website').nullable()
      table.string('timezone').nullable()
      table.string('language', 2).defaultTo('en')
      table.json('preferences').nullable()
      
      // TENANT ISOLATION: User profiles belong to a tenant
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