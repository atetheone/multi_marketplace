import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class DeliveryZone extends BaseModel {
  // static table = 'delivery_zones'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare fee: number

  @column()
  declare tenantId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
