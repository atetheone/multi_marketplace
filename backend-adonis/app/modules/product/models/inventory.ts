import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Tenant from '#tenant/models/tenant'
import Product from './product.js'

export default class Inventory extends BaseModel {
  static table = 'inventory'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare quantity: number

  @column({ columnName: 'reserved_quantity' })
  declare reservedQuantity: number

  @column()
  declare reorderPoint: number

  @column()
  declare reorderQuantity: number

  @column()
  declare lowStockThreshold: number

  @column()
  declare tenantId: number

  @column()
  declare productId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>
}
