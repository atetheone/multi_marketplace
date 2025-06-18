// import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ExtractModelRelations, ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from './permission.js'
import { DateTime } from 'luxon'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare tenantId: number | null // null for global roles

  @manyToMany(() => Permission, {
    pivotTable: 'role_permission',
  })
  declare permissions: ManyToMany<typeof Permission>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Méthode pour charger les permissions
  public async loadPermissions() {
    await this.load('permissions' as ExtractModelRelations<this>)
    return this
  }
}
