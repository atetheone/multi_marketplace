import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import MenuItem from '#navigation/models/menu_item'
import MenuItemService from '#navigation/services/menu_item_service'
import {
  createMenuItemValidator,
  updateMenuItemValidator,
} from '#navigation/validators/menu_item_validator'
import { ApiResponse } from '#utils/api_response'
import type { CreateMenuItemDto, UpdateMenuItemDto } from '#navigation/types/menu_item'
@inject()
export default class MenuItemController {
  constructor(protected menuItemService: MenuItemService) {}

  public async getUserMenu({ auth, response, request }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized()
    }

    const tenant = request.tenant

    await user.load('roles', (rolesQuery) => {
      rolesQuery.preload('permissions')
    })

    // console.log('User: ' + JSON.stringify(user, null, 2))

    const permissionCodes: string[] = user.roles.flatMap((role) =>
      role.permissions.map((p) => `${p.resource}:${p.action}`)
    )

    console.log(`User ${user.firstName} permissions: ${JSON.stringify(permissionCodes, null, 1)}`)

    const menuStructure = await this.menuItemService.getMenuStructure(tenant.id, permissionCodes)

    return ApiResponse.success(response, 'User menu retrieved successfully', menuStructure)
  }

  // Create a new menu item
  async create({ request, auth, response }: HttpContext) {
    const tenant = request.tenant
    const data: CreateMenuItemDto = await request.validateUsing(createMenuItemValidator)

    console.log('Received menu item data:', data)

    const menuItem = await this.menuItemService.createMenuItem({
      ...data,
      tenantId: tenant.id,
    })

    return ApiResponse.created(response, 'Menu item created successfully', menuItem)
  }

  // List all menu items
  async index({ request, response }: HttpContext) {
    const tenant = request.tenant
    const menuItems = await this.menuItemService.listMenuItems(tenant.id)

    return ApiResponse.success(response, 'Menu items retrieved successfully', menuItems)
  }

  // Get details of a specific menu item
  async show({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    const menuItem = await this.menuItemService.getMenuItem(params.id, tenant.id)

    return ApiResponse.success(response, 'Menu item retrieved successfully', menuItem)
  }

  // Update an existing menu item
  async update({ request, params, response }: HttpContext) {
    const tenant = request.tenant
    const data: UpdateMenuItemDto = await request.validateUsing(updateMenuItemValidator)
    const menuItem = await this.menuItemService.updateMenuItem({
      ...data,
      id: params.id,
      tenantId: tenant.id,
    })

    return ApiResponse.success(response, 'Menu item updated successfully', menuItem)
  }

  // Delete a menu item
  async destroy({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    await this.menuItemService.deleteMenuItem(params.id, tenant.id)

    return ApiResponse.success(response, 'Menu item deleted successfully')
  }
}
