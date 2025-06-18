import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UserService from '#user/services/user_service'
import {
  createUserValidator,
  updateUserValidator,
  updateProfileValidator,
} from '#user/validators/user_validator'
import { ApiResponse } from '#utils/api_response'

@inject()
export default class UserController {
  constructor(protected userService: UserService) {}

  async create({ request, response }: HttpContext) {
    const tenant = request.tenant!

    const data = await request.validateUsing(createUserValidator)

    const user = await this.userService.createUser({
      ...data,
      tenantId: +tenant.id,
    })
    return ApiResponse.created(response, 'User created successfully', user)
  }

  async update({ request, response, auth }: HttpContext) {
    const tenant = request.tenant
    const data = await request.validateUsing(updateUserValidator)

    const user = await this.userService.updateUser(data, tenant.id)

    return ApiResponse.success(response, 'User updated successfully', user)
  }

  async delete({ request, params, response, auth }: HttpContext) {
    const tenant = request.tenant
    await this.userService.deleteUser(params.id, tenant.id)

    return ApiResponse.success(response, 'User deleted successfully')
  }

  async show({ request, params, response, auth }: HttpContext) {
    const tenant = request.tenant
    const user = await this.userService.getUser(params.id, tenant.id)

    return ApiResponse.success(response, 'User retrieved successfully', user)
  }

  async index({ request, response, auth }: HttpContext) {
    const tenant = request.tenant
    const users = await this.userService.getUsers(tenant.id)

    return ApiResponse.success(response, 'Users retrieved successfully', users)
  }

  async updateProfile({ request, auth, response }: HttpContext) {
    const userId = auth.user!.id
    const tenant = request.tenant
    const userData = await request.validateUsing(updateProfileValidator)

    const user = await this.userService.updateProfile(userData, userId, tenant.id)

    return ApiResponse.success(response, 'User profile updated successfully', user)
  }

  async getUsersWithRole({ request, response }: HttpContext) {
    const tenant = request.tenant
    const { role } = request.qs()
    const users = await this.userService.getUsersWithRole(role, tenant?.id)

    return ApiResponse.success(response, 'Users retrieved successfully', users)
  }
}
