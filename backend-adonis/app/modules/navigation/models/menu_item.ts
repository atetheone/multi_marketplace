// app/modules/navigation/models/menu_item.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from '#role/models/permission'
import Tenant from '#tenant/models/tenant'

export default class MenuItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare label: string

  @column()
  declare route?: string

  @column()
  declare icon?: string

  @column()
  declare parentId?: number

  @column()
  declare order: number

  @column()
  declare isActive: boolean

  @column()
  declare isInternal: boolean

  @column()
  declare tenantId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => MenuItem, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof MenuItem>

  @hasMany(() => MenuItem, { foreignKey: 'parentId' })
  declare children: HasMany<typeof MenuItem>

  @manyToMany(() => Permission, {
    pivotTable: 'menu_item_permissions',
  })
  declare requiredPermissions: ManyToMany<typeof Permission>

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>
}
