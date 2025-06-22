import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'delivery_person_zones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('delivery_person_id').unsigned().notNullable()
      table.integer('zone_id').unsigned().notNullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table
        .foreign('delivery_person_id')
        .references('id')
        .inTable('delivery_persons')
        .onDelete('CASCADE')
      table.foreign('zone_id').references('id').inTable('delivery_zones').onDelete('CASCADE')

      // Unique constraint: delivery person-zone combination
      table.unique(['delivery_person_id', 'zone_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
