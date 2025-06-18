import MenuItem from '#navigation/models/menu_item'
import { CreateMenuItemDto, UpdateMenuItemDto } from '#navigation/types/menu_item'
import { Exception } from '@adonisjs/core/exceptions'

export default class MenuItemService {
  /**
   * Create a new menu item
   */
  async createMenuItem(data: CreateMenuItemDto & { tenantId: number }) {
    const nextOrder = await this.calculateNextOrderValue(data.tenantId, data?.parentId)

    const menuItem = await MenuItem.create({
      label: data.label,
      route: data.route,
      icon: data.icon,
      parentId: data.parentId,
      order: nextOrder,
      isActive: data.isActive,
      isInternal: data.isInternal,
      tenantId: data.tenantId,
    })

    if (data.requiredPermissions?.length) {
      await menuItem.related('requiredPermissions').attach(data.requiredPermissions)
    }

    await menuItem.load('requiredPermissions')

    return menuItem
  }

  /**
   * List all menu items for a tenant
   */
  async listMenuItems(tenantId: number) {
    return await MenuItem.query()
      .where('tenant_id', tenantId)
      .preload('requiredPermissions')
      .orderBy('order', 'asc')
  }

  /**
   * Get a specific menu item
   */
  async getMenuItem(id: number, tenantId: number) {
    const menuItem = await MenuItem.query()
      .where('id', id)
      .where('tenant_id', tenantId)
      .preload('requiredPermissions')
      .preload('children', (query) => {
        query.preload('requiredPermissions')
      })
      .first()

    if (!menuItem) {
      throw new Exception('Menu item not found', {
        status: 404,
        code: 'MENU_ITEM_NOT_FOUND',
      })
    }

    return menuItem
  }

  /**
   * Update an existing menu item
   */
  async updateMenuItem(data: UpdateMenuItemDto & { id: number; tenantId: number }) {
    const menuItem = await MenuItem.query()
      .where('id', data.id)
      .where('tenant_id', data.tenantId)
      .firstOrFail()

    await menuItem
      .merge({
        label: data.label,
        route: data.route,
        parentId: data.parentId,
        order: data.order,
        isActive: data.isActive,
        isInternal: data.isInternal,
      })
      .save()

    if (data.requiredPermissions?.length) {
      await menuItem.related('requiredPermissions').sync(data.requiredPermissions)
    }
    await menuItem.load('requiredPermissions')

    return menuItem
  }

  /**
   * Delete a menu item
   */
  async deleteMenuItem(id: number, tenantId: number) {
    const menuItem = await MenuItem.query()
      .where('id', id)
      .where((query) => {
        query.whereNull('tenant_id').orWhere('tenant_id', tenantId)
      })
      .firstOrFail()

    await menuItem.delete()
  }

  /**
   * Get menu structure with nested items
   */
  async #getMenuStructure(tenantId: number) {
    // First, get all menu items for the tenant
    const allMenuItems = await MenuItem.query()
      .where((query) => {
        query.whereNull('tenant_id').orWhere('tenant_id', tenantId)
      })
      .where('is_active', true)
      .preload('requiredPermissions', (query) => {
        query.select(['resource', 'action'])
      })
      .orderBy('order', 'asc')
    // Build tree structure
    const buildTree = (parentId: number | null = null): any[] => {
      return allMenuItems
        .filter((item) => item.parentId === parentId)
        .map((item) => {
          const permissionCodes = item.requiredPermissions.map((p) => `${p.resource}:${p.action}`)
          return {
            id: item.id,
            label: item.label,
            route: item.route,
            icon: item.icon,
            order: item.order,
            isActive: item.isActive,
            isInternal: item.isInternal,
            requiredPermissions: permissionCodes,
            children: buildTree(item.id),
          }
        })
    }

    return buildTree(null)
  }

  public async getMenuStructure(tenantId: number, permissionCodes: string[]) {
    const menu = await this.#getMenuStructure(tenantId)

    return this.filterMenuByPermissions(menu, permissionCodes)
  }

  private filterMenuByPermissions(menus: any[], userPermissions: string[]) {
    return menus.filter((menu) => {
      const hasAccess =
        menu.requiredPermissions.length === 0 ||
        menu.requiredPermissions.some((permission: string) => userPermissions.includes(permission))

      if (menu.children && menu.children.length > 0) {
        menu.children = this.filterMenuByPermissions(menu.children, userPermissions)
        return hasAccess || menu.children.length > 0
      }

      return hasAccess
    })
  }

  private filterMenuByPermissionsBis(menus: any[], userPermissions: string[]) {
    return menus.filter((menu) => {
      const menuPermissions = menu.requiredPermissions.map((p) => `${p.action}:${p.resource}`)
      const hasAccess =
        menuPermissions.length === 0 || menuPermissions.some((p) => userPermissions.includes(p))

      if (menu.children && menu.children.length > 0) {
        menu.children = this.filterMenuByPermissions(menu.children, userPermissions)
        return hasAccess || menu.children.length > 0
      }

      return hasAccess
    })
  }

  /**
   * Calculate the next order value for a new menu item
   */
  private async calculateNextOrderValue(tenantId: number, parentId?: number) {
    const menuItemQuery = MenuItem.query().where((query) => {
      query.whereNull('tenant_id').orWhere('tenant_id', tenantId)
    })

    if (parentId) {
      menuItemQuery.where('parent_id', parentId)
    } else {
      menuItemQuery.whereNull('parent_id')
    }

    const lastItemQuery = await menuItemQuery.orderBy('order', 'desc').first()

    return lastItemQuery ? lastItemQuery.order + 1 : 1
  }
}
