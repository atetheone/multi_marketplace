import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import DeliveryPerson from '#deliveries/models/delivery_person'
import Order from '#order/models/order'

export default class Delivery extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare deliveryPersonId: number

  @column()
  declare notes?: string

  @column.dateTime()
  declare assignedAt?: DateTime

  @column.dateTime()
  declare pickedAt?: DateTime

  @column.dateTime()
  declare deliveredAt?: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => DeliveryPerson, { foreignKey: 'deliveryPersonId' })
  declare deliveryPerson: BelongsTo<typeof DeliveryPerson>

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>
}
