import { inject } from '@adonisjs/core'
import Resource from '#role/models/resource'
import Permission from '#role/models/permission'
import { Exception } from '@adonisjs/core/exceptions'
import { CreateResourceDto, UpdateResourceDto } from '#role/types/resource'

@inject()
export class ResourceService {
  async listResources(tenantId?: number) {
    return await Resource.query()
      .where((query) => {
        query.whereNull('tenant_id')
        if (tenantId) {
          query.orWhere('tenant_id', tenantId)
        }
      })
      .orderBy('name')
  }

  async createResource(data: CreateResourceDto) {
    // Check for existing resource
    const existing = await Resource.query()
      .where('name', data.name)
      .where((query) => {
        query.whereNull('tenant_id')
        if (data.tenantId) {
          query.orWhere('tenant_id', data.tenantId)
        }
      })
      .first()

    if (existing) {
      throw new Exception('Resource already exists', { status: 409 })
    }

    const resource = await Resource.create({
      ...data,
      isActive: true,
      availableActions: JSON.stringify(data.availableActions),
    })

    // Create default permissions for the resource
    await this.createResourcePermissions(resource)

    return resource
  }

  async getResourceWithPermissions(id: number, tenantId?: number) {
    const resource = await Resource.query()
      .where('id', id)
      .where((query) => {
        query.whereNull('tenant_id')
        if (tenantId) {
          query.orWhere('tenant_id', tenantId)
        }
      })
      .preload('permissions')
      .firstOrFail()

    return resource
  }

  private async createResourcePermissions(resource: Resource) {
    const actions =
      typeof resource.availableActions === 'string'
        ? JSON.parse(resource.availableActions)
        : resource.availableActions

    const permissions = actions.map((action) => ({
      resource: resource.name,
      action,
      tenantId: resource.tenantId,
    }))

    await Permission.createMany(permissions)
  }

  async syncResourcePermissions(resourceId: number, tenantId?: number) {
    const resource = await this.getResourceWithPermissions(resourceId, tenantId)

    // Parse availableActions if it's a string
    const availableActions =
      typeof resource.availableActions === 'string'
        ? JSON.parse(resource.availableActions)
        : resource.availableActions

    // Get existing permissions
    const existingPermissions = await Permission.query()
      .where('resource_id', resourceId)
      .where((query) => {
        query.whereNull('tenant_id')
        if (tenantId) {
          query.orWhere('tenant_id', tenantId)
        }
      })

    // Calculate permissions to add and remove
    const existingActions = existingPermissions.map((p) => p.action)
    const actionsToAdd = availableActions.filter((action) => !existingActions.includes(action))
    const permissionsToRemove = existingPermissions.filter(
      (p) => !availableActions.includes(p.action)
    )

    // Create new permissions
    if (actionsToAdd.length) {
      await Permission.createMany(
        actionsToAdd.map((action) => ({
          resource: resource.name,
          action,
          resourceId: resource.id,
          tenantId: resource.tenantId,
        }))
      )
    }

    // Remove obsolete permissions
    if (permissionsToRemove.length) {
      await Permission.query()
        .whereIn(
          'id',
          permissionsToRemove.map((p) => p.id)
        )
        .delete()
    }

    return await this.getResourceWithPermissions(resourceId, tenantId)
  }

  async updateResource(resourceId: number, data: UpdateResourceDto, tenantId?: number) {
    const resource = await Resource.query()
      .where('id', resourceId)
      .where((query) => {
        query.whereNull('tenant_id')
        if (tenantId) {
          query.orWhere('tenant_id', tenantId)
        }
      })
      .firstOrFail()

    const updateData = { ...data }

    // Ensure availableActions is properly JSON-formatted if present
    if (updateData.availableActions) {
      updateData.availableActions = JSON.stringify(updateData.availableActions)
    }

    resource.merge(updateData)
    await resource.save()

    return resource
  }

  async deleteResource(resourceId: number, tenantId?: number) {
    const resource = await Resource.query()
      .where('id', resourceId)
      .where((query) => {
        query.whereNull('tenant_id')
        if (tenantId) {
          query.orWhere('tenant_id', tenantId)
        }
      })
      .firstOrFail()

    await resource.delete()
  }
}
