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

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => {
      // Handle null/undefined values
      if (!value) {
        return []
      }
      
      // If it's already an array, return it
      if (Array.isArray(value)) {
        return value
      }
      
      // If it's a string, try to parse as JSON
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          return Array.isArray(parsed) ? parsed : [value]
        } catch {
          // If it's not valid JSON, treat as a single action
          return [value]
        }
      }
      
      return []
    },
  })
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
