import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Resource from './resource.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare resource: string // e.g. "products"

  @column()
  declare resourceId: number // Reference to resources table

  @column()
  declare action: string // e.g. "create"

  @column()
  declare scope: 'all' | 'own' | 'dept' | 'tenant' | null

  @column()
  declare tenantId: number | null // null for global permissions

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Resource, {
    foreignKey: 'resourceId',
  })
  declare resourceDetails: BelongsTo<typeof Resource>
}
