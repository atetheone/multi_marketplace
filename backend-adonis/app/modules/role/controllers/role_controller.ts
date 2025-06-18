import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import RoleService from '#role/services/role_service'
import {
  createRoleValidator,
  updateRoleValidator,
  assignRoleValidator,
} from '#role/validators/role_validator'
import { CreateRoleDto, UpdateRoleDto, AssignRoleDto } from '#role/types/role'
import { ApiResponse } from '#utils/api_response'

@inject()
export default class RolesController {
  constructor(protected roleService: RoleService) {}

  // Create a new role
  async create({ request, auth, response }: HttpContext) {
    const tenant = request.tenant
    const data: CreateRoleDto = await request.validateUsing(createRoleValidator)
    // TO DO: Validation
    const role = await this.roleService.createRole({
      ...data,
      tenantId: tenant.id,
    })

    return ApiResponse.created(response, 'Role created successfully', role)
  }

  // List all roles for a tenant
  async index({ request, auth, response }: HttpContext) {
    const tenant = request.tenant
    console.log('Tenant Id1: ' + tenant.id)
    const roles = await this.roleService.listRoles(tenant.id)

    return ApiResponse.success(response, 'Roles retrieved successfully', roles)
  }

  // Get details of a specific role
  async show({ request, params, auth, response }: HttpContext) {
    const tenant = request.tenant
    const role = await this.roleService.getRole(params.id, tenant.id)

    return ApiResponse.success(response, 'Role retrieved successfully', role)
  }

  // Update an existing role
  async update({ request, params, auth, response }: HttpContext) {
    const tenant = request.tenant

    const data: UpdateRoleDto = await request.validateUsing(updateRoleValidator)
    const role = await this.roleService.updateRole({
      ...data,
      id: params.id,
      tenantId: tenant.tenantId,
    })
    return ApiResponse.success(response, 'Role updated successfully', role)
  }

  // Delete a role
  async destroy({ params, auth, response }: HttpContext) {
    const tenant = request.tenant

    await this.roleService.deleteRole(params.id, tenant.id)

    return ApiResponse.success(response, 'Role deleted successfully')
  }

  // Assign roles to a user
  async assignRoles({ request, response }: HttpContext) {
    const data: AssignRoleDto = await request.validateUsing(assignRoleValidator)
    await this.roleService.assignRolesToUser(data)

    return ApiResponse.success(response, 'Roles assigned successfully')
  }
}
