import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import PermissionService from '#role/services/permission_service'
import {
  createPermissionValidator,
  updatePermissionValidator,
} from '#role/validators/permission_validator'
import { CreatePermissionDto, UpdatePermissionDto } from '#role/types/permission'
import { ApiResponse } from '#utils/api_response'

@inject()
export default class PermissionController {
  constructor(protected permissionService: PermissionService) {}

  // Create a new permission
  async create({ request, response }: HttpContext) {
    const tenant = request.tenant
    const data: CreatePermissionDto = await request.validateUsing(createPermissionValidator)
    const permission = await this.permissionService.createPermission({
      ...data,
      tenantId: tenant.id,
    })

    return ApiResponse.created(response, 'Permission created successfully', permission)
  }

  // List all permissions
  async index({ request, response }: HttpContext) {
    const tenant = request.tenant
    const permissions = await this.permissionService.listPermissions(tenant.id)

    return ApiResponse.success(response, 'Permissions retrieved successfully', permissions)
  }

  // Get details of a specific permission
  async show({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    const permission = await this.permissionService.getPermissionById(params.id, tenant.id)

    return ApiResponse.success(response, 'Permission retrieved successfully', permission)
  }

  // Update an existing permission
  async update({ request, params, auth, response }: HttpContext) {
    const tenant = request.tenant
    const data: UpdatePermissionDto = await request.validateUsing(updatePermissionValidator)
    const permission = await this.permissionService.updatePermission({
      ...data,
      id: params.id,
      tenantId: tenant.id,
    })
    return ApiResponse.success(response, 'Permission updated successfully', permission)
  }

  // Delete a permission
  async destroy({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    await this.permissionService.deletePermission(params.id, tenant.id)

    return ApiResponse.success(response, 'Permission deleted successfully')
  }

  async syncResource({ params, request, response }: HttpContext) {
    const permissions = await this.permissionService.syncResourcePermissions(
      params.resourceId,
      request.tenant?.id
    )
    return ApiResponse.success(response, 'Resource permissions synced successfully', permissions)
  }
}
