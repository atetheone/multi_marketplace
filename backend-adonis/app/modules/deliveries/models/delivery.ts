import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import DeliveryPerson from '#deliveries/models/delivery_person'
import Order from '#order/models/order'
import Tenant from '#tenant/models/tenant'

export default class Delivery extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare deliveryPersonId: number

  @column()
  declare status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'returned'

  @column.dateTime()
  declare assignedAt: DateTime | null

  @column.dateTime()
  declare pickedUpAt: DateTime | null

  @column.dateTime()
  declare deliveredAt: DateTime | null

  @column.dateTime()
  declare estimatedDeliveryTime: DateTime | null

  @column()
  declare notes: string | null

  @column()
  declare deliveryNotes: string | null

  @column()
  declare trackingData: any | null

  @column()
  declare proofOfDelivery: string | null

  @column()
  declare failureReason: string | null

  // TENANT ISOLATION: Deliveries belong to a tenant
  @column()
  declare tenantId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @belongsTo(() => DeliveryPerson, { foreignKey: 'deliveryPersonId' })
  declare deliveryPerson: BelongsTo<typeof DeliveryPerson>

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>
}
