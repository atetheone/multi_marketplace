import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#user/models/user'
import Role from '#role/models/role'
import MenuItem from '#navigation/models/menu_item'

export default class Tenant extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare domain: string

  @column()
  declare description: string

  @column()
  declare status: 'active' | 'inactive' | 'suspended' | 'pending'

  @column()
  declare rating: number

  @column()
  declare logo?: string

  @column()
  declare coverImage?: string

  @column()
  declare productCount: number

  @column()
  declare isFeatured: boolean

  @manyToMany(() => User, {
    pivotTable: 'user_tenants',
  })
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Role)
  declare roles: ManyToMany<typeof Role>

  @hasMany(() => MenuItem)
  declare menuItems: HasMany<typeof MenuItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
