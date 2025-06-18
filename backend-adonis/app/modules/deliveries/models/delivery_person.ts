import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#user/models/user'
import Tenant from '#tenant/models/tenant'
import DeliveryZone from '#address/models/delivery_zone'

export default class DeliveryPerson extends BaseModel {
  static table = 'delivery_persons'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare tenantId: number

  @column()
  declare isActive: boolean

  @column()
  declare isAvailable: boolean

  // @column()
  // declare workingHours: any

  @column.dateTime()
  declare lastActiveAt: DateTime

  @column.dateTime()
  declare lastDeliveryAt: DateTime

  @column()
  declare vehicleType: 'motorcycle' | 'bicycle' | 'car' | 'van'

  @column()
  declare vehiclePlateNumber: string

  @column()
  declare vehicleModel: string

  @column()
  declare vehicleYear: number

  @column()
  declare licenseNumber: string

  @column.date()
  declare licenseExpiry: DateTime

  @column()
  declare licenseType: string

  @column()
  declare totalDeliveries: number

  @column()
  declare completedDeliveries: number

  @column()
  declare returnedDeliveries: number

  @column()
  declare averageDeliveryTime: number

  @column()
  declare rating: number

  @column()
  declare totalReviews: number

  @column()
  declare notes: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare verifiedAt: DateTime

  @column()
  declare verifiedBy: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @manyToMany(() => DeliveryZone, {
    pivotTable: 'delivery_person_zones',
    pivotForeignKey: 'delivery_person_id',
    pivotRelatedForeignKey: 'zone_id',
    pivotColumns: ['is_active'],
  })
  declare zones: ManyToMany<typeof DeliveryZone>
}
