import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { ManyToMany, HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'
import Tenant from '#tenant/models/tenant'
import Order from '#order/models/order'
import Cart from '#cart/models/cart'
import Role from '#role/models/role'
import UserProfile from './user_profile.js'
import Address from '#address/models/address'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare status: 'active' | 'inactive' | 'suspended' | 'pending'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare lastLoginAt: DateTime | null

  @manyToMany(() => Tenant, {
    pivotTable: 'user_tenants',
  })
  declare tenants: ManyToMany<typeof Tenant>

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
  })
  declare roles: ManyToMany<typeof Role>

  @hasOne(() => UserProfile)
  declare profile: HasOne<typeof UserProfile>

  @manyToMany(() => Address, {
    pivotTable: 'users_addresses',
  })
  declare addresses: ManyToMany<typeof Address>

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>

  @hasMany(() => Cart)
  declare carts: HasMany<typeof Cart>

  /**
   * Check if user has all of the specified roles
   */
  async hasRole(roleNames: string[]): Promise<boolean> {
    const roles = await this.related('roles').query()
    return roles.some((role) => roleNames.includes(role.name))
  }

  /**
   * Check if user has the specified permission through any of their roles
   */
  async hasPermission(permission: string): Promise<boolean> {
    const roles = await this.related('roles').query().preload('permissions')

    return roles.some((role) =>
      role.permissions.some((perm) => `${perm.resource}:${perm.action}` === permission)
    )
  }

  /**
   * Check if user has all of the specified permissions
   */
  async hasAllPermissions(permissions: string[]): Promise<boolean> {
    const roles = await this.related('roles').query().preload('permissions')

    return permissions.every((requiredPermission) =>
      roles.some((role) =>
        role.permissions.some((perm) => `${perm.resource}:${perm.action}` === requiredPermission)
      )
    )
  }
}
