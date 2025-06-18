import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany, HasOne } from '@adonisjs/lucid/types/relations'
import Tenant from '#tenant/models/tenant'
import ProductImage from './product_image.js'
import Category from './category.js'
import Inventory from './inventory.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare sku: string

  // @column()
  // declare stock: number
  // inventory instead

  @column()
  declare isActive: boolean

  @column()
  declare isMarketplaceVisible: boolean

  @column()
  declare marketplacePriority: number

  @column()
  declare averageRating: number

  @column()
  declare tenantId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @hasMany(() => ProductImage)
  declare images: HasMany<typeof ProductImage>

  @manyToMany(() => Category, {
    pivotTable: 'category_products',
  })
  declare categories: ManyToMany<typeof Category>

  @hasOne(() => Inventory, {
    pivotTable: 'inventory',
  })
  declare inventory: HasOne<typeof Inventory>

  // Helper method to get cover image
  async getCoverImage() {
    return await this.related('images').query().where('is_cover', true).first()
  }
}
