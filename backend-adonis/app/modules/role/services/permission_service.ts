import Permission from '#role/models/permission'
import Resource from '#role/models/resource'
import { Exception } from '@adonisjs/core/exceptions'
import { CreatePermissionDto, UpdatePermissionDto } from '#role/types/permission'

export default class PermissionService {
  async createPermission(data: CreatePermissionDto) {
    const resource = await Resource.query()
      .where('id', data.resourceId)
      .where((query) => {
        query.whereNull('tenant_id')
        if (data.tenantId) {
          query.orWhere('tenant_id', data.tenantId)
        }
      })
      .firstOrFail()

    if (!resource.availableActions.includes(data.action)) {
      throw new Exception(
        `Action "${data.action}" is not available for resource "${data.resource}"`,
        { status: 400 }
      )
    }

    const permission = await Permission.create({
      action: data.action,
      resource: resource.name,
      resourceId: resource.id,
      scope: data.scope,
      tenantId: data.tenantId,
    })

    // const permission = await Permission.create({
    //   action: data.action,
    //   resource: data.resource,
    //   tenantId: data.tenantId ?? null,
    // })

    return permission
  }

  async listPermissions(tenantId?: number) {
    return await Permission.query()
      .where((query) => {
        query.whereNull('tenant_id')
        if (tenantId) {
          query.orWhere('tenant_id', tenantId)
        }
      })
      .preload('resourceDetails')
      .orderBy(['resource', 'action'])
  }

  async getPermission(permissionId: number, tenantId?: number) {
    const permission = await Permission.query()
      .where('id', permissionId)
      .where((query) => {
        query.whereNull('tenant_id').orWhere('tenant_id', tenantId!)
      })
      .select('id', 'action', 'resource')
      .firstOrFail()

    return permission
  }

  async updatePermission(data: UpdatePermissionDto) {
    const permission = await this.getPermissionById(data.id, data.tenantId)

    // If changing resource/action, validate against resource
    if (data.resource || data.action) {
      const resource = await Resource.query()
        .where('name', data.resource || permission.resource)
        .where((query) => {
          query.whereNull('tenant_id')
          if (data.tenantId) {
            query.orWhere('tenant_id', data.tenantId)
          }
        })
        .firstOrFail()

      const newAction = data.action || permission.action
      if (!resource.availableActions.includes(newAction)) {
        throw new Exception(
          `Action "${newAction}" is not available for resource "${resource.name}"`,
          { status: 400 }
        )
      }

      if (data.resource) {
        permission.resource = data.resource
        permission.resourceId = resource.id
      }
    }

    await permission
      .merge({
        action: data.action || permission.action,
        scope: data.scope || permission.scope,
      })
      .save()

    return permission
  }

  async deletePermission(permissionId: number, tenantId?: number) {
    const permission = await this.getPermissionById(permissionId, tenantId)

    await permission.delete()
  }

  async getPermissionById(id: number, tenantId?: number) {
    return await Permission.query()
      .where('id', id)
      .where((query) => {
        query.whereNull('tenant_id')
        if (tenantId) {
          query.orWhere('tenant_id', tenantId)
        }
      })
      .preload('resourceDetails')
      .firstOrFail()
  }

  async syncResourcePermissions(resourceId: number, tenantId?: number) {
    const resource = await Resource.findOrFail(resourceId)

    // Get existing permissions
    const existingPermissions = await Permission.query()
      .where('resource_id', resourceId)
      .where((query) => {
        query.whereNull('tenant_id')
        if (tenantId) {
          query.orWhere('tenant_id', tenantId)
        }
      })

    // Create missing permissions
    const existingActions = existingPermissions.map((p) => p.action)
    const actionsToCreate = resource.availableActions.filter(
      (action) => !existingActions.includes(action)
    )

    if (actionsToCreate.length) {
      await Permission.createMany(
        actionsToCreate.map((action) => ({
          action,
          resource: resource.name,
          resourceId: resource.id,
          tenantId,
        }))
      )
    }

    // Remove obsolete permissions
    const obsoletePermissions = existingPermissions.filter(
      (p) => !resource.availableActions.includes(p.action)
    )

    if (obsoletePermissions.length) {
      await Permission.query()
        .whereIn(
          'id',
          obsoletePermissions.map((p) => p.id)
        )
        .delete()
    }

    return await this.listPermissions(tenantId)
  }
}
