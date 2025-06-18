import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permissions'

  async up() {
    // First, create a temporary backup of existing permissions
    await this.db.rawQuery('CREATE TABLE permissions_backup AS SELECT * FROM permissions')

    // Add resource_id column and foreign key
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('resource_id')
        .unsigned()
        .references('id')
        .inTable('resources')
        .onDelete('CASCADE')
        .nullable()

      // Add scope column for granular permissions
      table.string('scope').nullable() // e.g., 'own', 'all', 'department'
    })

    // Create migration helper for transferring data
    const Resource = await import('#role/models/resource')
    const Permission = await import('#role/models/permission')

    // Migrate existing permissions to the new structure
    const existingPermissions = await this.db.query().from('permissions_backup')

    for (const permission of existingPermissions) {
      // Create resource if it doesn't exist
      const resource = await Resource.default.firstOrCreate(
        {
          name: permission.resource,
          tenantId: permission.tenant_id,
        },
        {
          description: `Resource for ${permission.resource}`,
          availableActions: [permission.action],
        }
      )

      // Update permission with resource_id
      await Permission.default
        .query()
        .where('id', permission.id)
        .update({ resource_id: resource.id })
    }

    // Drop the backup table
    await this.db.rawQuery('DROP TABLE permissions_backup')
  }

  async down() {
    // Revert changes if needed
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('resource_id')
      table.dropColumn('scope')
    })
  }
}
