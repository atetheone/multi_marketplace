import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Permission from './permission.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string // e.g., 'products', 'orders'

  @column()
  declare description: string

  @column()
  declare isActive: boolean

  @column()
  declare availableActions: string[]

  @column()
  declare tenantId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Permission)
  declare permissions: HasMany<typeof Permission>
}
