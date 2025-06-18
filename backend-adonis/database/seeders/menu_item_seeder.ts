import { BaseSeeder } from '@adonisjs/lucid/seeders'
import MenuItem from '#navigation/models/menu_item'
import Permission from '#role/models/permission'

export default class MenuItemSeeder extends BaseSeeder {
  async run() {
    const defaultMenus = [
      {
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/dashboard',
        order: 1,
        isInternal: true,
        permissionIds: [25], // read:dashboard
        children: [],
      },
      {
        label: 'User management',
        icon: 'people',
        route: '/dashboard/users',
        order: 2,
        isActive: true,
        isInternal: true,
        permissionIds: [14, 13], // [read:users, create:users]
        children: [
          {
            label: 'View Users',
            icon: 'list',
            route: '/dashboard/users',
            isActive: true,
            isInternal: true,
            permissionIds: [14], // read:users
          },
          {
            label: 'Create User',
            icon: 'person_add',
            route: '/dashboard/users/create',
            isActive: true,
            isInternal: true,
            permissionIds: [13], // create:users
          },
        ],
      },
      {
        label: 'Tenant management',
        icon: 'business',
        route: '/dashboard/tenants',
        order: 3,
        isActive: true,
        isInternal: true,
        permissionIds: [2, 1], // [read:tenants, create:tenants]
        children: [
          {
            label: 'View Tenants',
            icon: 'list',
            route: '/dashboard/tenants',
            isActive: true,
            isInternal: true,
            permissionIds: [2], // read:tenants
          },
          {
            label: 'Create Tenant',
            icon: 'add_business',
            route: '/dashboard/tenants/create',
            isActive: true,
            isInternal: true,
            permissionIds: [1], // create:tenants
          },
        ],
      },
      {
        label: 'Roles & Permissions',
        icon: 'security',
        route: '/dashboard/roles',
        order: 4,
        isActive: true,
        isInternal: true,
        permissionIds: [18, 17], // [read:roles, create:roles]
        children: [
          {
            label: 'View Roles',
            icon: 'list',
            route: '/dashboard/roles',
            isActive: true,
            isInternal: true,
            permissionIds: [18], // read:roles
          },
          {
            label: 'Create Role',
            icon: 'add',
            route: '/dashboard/roles/create',
            isActive: true,
            isInternal: true,
            permissionIds: [17], // create:roles
          },
        ],
      },
      {
        label: 'Products',
        icon: 'inventory_2',
        route: '/dashboard/products',
        order: 5,
        isActive: true,
        isInternal: true,
        permissionIds: [26, 27], // [read:products, create:products]
        children: [
          {
            label: 'View Products',
            icon: 'list',
            route: '/dashboard/products',
            isActive: true,
            isInternal: true,
            permissionIds: [27], // read:products
          },
          {
            label: 'Create Role',
            icon: 'add',
            route: '/dashboard/products/create',
            isActive: true,
            isInternal: true,
            permissionIds: [26], // create:products
          },
        ],
      },
    ]

    // Create menus and attach permissions
    for (const menu of defaultMenus) {
      const { children, permissionIds, ...menuData } = menu
 
      // Create parent menu item
      const menuItem = await MenuItem.create(menuData)

      // Attach permissions directly using IDs
      if (permissionIds && permissionIds.length > 0) {
        await menuItem.related('requiredPermissions').attach(permissionIds)
      }

      // Create and attach permissions for children
      if (children && children.length > 0) {
        for (const child of children) {
          const { permissionIds: childPermissionIds, ...childData } = child

          // Create child menu item
          const childMenuItem = await MenuItem.create({
            ...childData,
            parentId: menuItem.id,
          })

          // Attach permissions directly using IDs for child
          if (childPermissionIds && childPermissionIds.length > 0) {
            await childMenuItem.related('requiredPermissions').attach(childPermissionIds)
          }
        }
      }
    }
  }
}
