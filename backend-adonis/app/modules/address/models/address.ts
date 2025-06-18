import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import type { ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#user/models/user'
import DeliveryZone from './delivery_zone.js'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: string

  @column({ columnName: 'address_line1' })
  declare addressLine1: string

  @column({ columnName: 'address_line2' })
  declare addressLine2?: string

  @column()
  declare city: string

  @column()
  declare state?: string

  @column()
  declare country: string

  @column()
  declare postalCode?: string

  @column()
  declare phone?: string

  @column()
  declare isDefault: boolean

  @column()
  declare tenantId: number

  @column()
  declare zoneId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'users_addresses',
  })
  declare users: ManyToMany<typeof User>

  @belongsTo(() => DeliveryZone, {
    foreignKey: 'zoneId',
  })
  declare zone: BelongsTo<typeof DeliveryZone>
}
