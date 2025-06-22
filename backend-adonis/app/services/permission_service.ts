import { inject } from '@adonisjs/core'
import Permission from '#role/models/permission'
import Resource from '#role/models/resource'
import Role from '#role/models/role'

@inject()
export default class PermissionService {
  /**
   * Check permission using backward compatibility
   * Supports both old format (resource:action) and new resource-based system
   */
  async checkPermission(
    userRoles: Role[],
    requiredPermission: string,
    tenantId?: number,
    userId?: number
  ): Promise<boolean> {
    const [resourceName, action] = requiredPermission.split(':')

    for (const role of userRoles) {
      // Load permissions with resource details
      await role.load('permissions', (query) => {
        query.preload('resourceDetails')
      })

      // Check both old and new permission formats
      const hasPermission = role.permissions.some((permission) => {
        // Old format check (resource:action string matching)
        const oldFormatMatch = permission.resource === resourceName && permission.action === action

        // New format check (resource_id based)
        const newFormatMatch =
          permission.resourceDetails?.name === resourceName && permission.action === action

        if (!oldFormatMatch && !newFormatMatch) {
          return false
        }

        // Apply scope-based filtering (future enhancement)
        return this.checkScope(permission, tenantId, userId)
      })

      if (hasPermission) return true
    }

    return false
  }

  /**
   * Scope checking logic (extensible for future UI implementation)
   */
  private checkScope(permission: Permission, tenantId?: number, _userId?: number): boolean {
    // If no scope specified, allow (backward compatibility)
    if (!permission.scope) return true

    switch (permission.scope) {
      case 'all':
        return true
      case 'tenant':
        return permission.tenantId === tenantId
      case 'own':
        // TODO: Implement user-specific logic when UI supports it
        return true
      case 'dept':
        // TODO: Implement department logic when UI supports it
        return true
      default:
        return false
    }
  }

  /**
   * Create permission using new resource-based system
   * Falls back to old format if resource not found
   */
  async createPermission(
    resourceName: string,
    action: string,
    tenantId?: number,
    scope: 'all' | 'tenant' | 'own' | 'dept' = 'tenant'
  ): Promise<Permission> {
    // Try to find the resource in the new table
    const resource = await Resource.query()
      .where('name', resourceName)
      .where((query) => {
        if (tenantId) {
          query.where('tenant_id', tenantId).orWhereNull('tenant_id')
        } else {
          query.whereNull('tenant_id')
        }
      })
      .first()

    return Permission.create({
      resource: resourceName, // Keep for backward compatibility
      resourceId: resource?.id || null, // Use new system if available
      action,
      scope,
      tenantId,
    })
  }

  /**
   * Get available actions for a resource (for UI building)
   */
  async getResourceActions(resourceName: string, tenantId?: number): Promise<string[]> {
    const resource = await Resource.query()
      .where('name', resourceName)
      .where((query) => {
        query.whereNull('tenant_id').orWhere('tenant_id', tenantId || null)
      })
      .first()

    if (resource) {
      return resource.availableActions
    }

    // Fallback to common actions for unknown resources
    return ['create', 'read', 'update', 'delete']
  }

  /**
   * Migrate existing permissions to use resource table
   */
  async migratePermissionsToResources(tenantId?: number): Promise<void> {
    // Get all unique resources from existing permissions
    const uniqueResources = await Permission.query()
      .where((builder) => {
        if (tenantId) {
          builder.where('tenant_id', tenantId)
        } else {
          builder.whereNull('tenant_id')
        }
      })
      .whereNull('resource_id') // Only unmigrated permissions
      .distinct('resource')

    for (const permRow of uniqueResources) {
      const resourceName = permRow.resource

      // Create resource if it doesn't exist
      let resource = await Resource.query()
        .where('name', resourceName)
        .where((builder) => {
          if (tenantId) {
            builder.where('tenant_id', tenantId)
          } else {
            builder.whereNull('tenant_id')
          }
        })
        .first()

      if (!resource) {
        // Get all actions for this resource
        const actions = await Permission.query()
          .where('resource', resourceName)
          .where('tenant_id', tenantId || null)
          .distinct('action')

        resource = await Resource.create({
          name: resourceName,
          description: `Auto-generated resource for ${resourceName}`,
          availableActions: actions.map((a) => a.action),
          tenantId: tenantId ?? null,
          isActive: true,
        })
      }

      // Update permissions to reference the resource
      await Permission.query()
        .where('resource', resourceName)
        .where('tenant_id', tenantId || null)
        .whereNull('resource_id')
        .update({ resourceId: resource.id })
    }
  }
}
