import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'delivery_person_zones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('delivery_person_id')
        .unsigned()
        .references('id')
        .inTable('delivery_persons')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('zone_id')
        .unsigned()
        .references('id')
        .inTable('delivery_zones')
        .onDelete('CASCADE')
        .notNullable()

      table.boolean('is_active').defaultTo(true)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.unique(['delivery_person_id', 'zone_id'])

      // Indexes
      table.index(['delivery_person_id'])
      table.index(['zone_id'])
      table.index(['is_active'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
