import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#role/models/role'
import Permission from '#role/models/permission'
import Resource from '#role/models/resource'

export default class extends BaseSeeder {
  async run() {
    // Get all resources to create permissions
    const resources = await Resource.all()

    // Create global roles (tenant_id = null)
    const superAdminRole = await Role.create({
      name: 'super-admin',
      description: 'Super administrateur - accès complet',
      isActive: true,
      tenantId: null, // Global role
    })

    const adminRole = await Role.create({
      name: 'admin',
      description: 'Administrateur tenant',
      isActive: true,
      tenantId: null, // Global role
    })

    const managerRole = await Role.create({
      name: 'manager',
      description: 'Gestionnaire',
      isActive: true,
      tenantId: null,
    })

    const employeeRole = await Role.create({
      name: 'employee',
      description: 'Employé',
      isActive: true,
      tenantId: null,
    })

    const customerRole = await Role.create({
      name: 'customer',
      description: 'Client',
      isActive: true,
      tenantId: null,
    })

    const deliveryPersonRole = await Role.create({
      name: 'delivery-person',
      description: 'Livreur',
      isActive: true,
      tenantId: null,
    })

    // Create permissions for each resource
    const permissions = []
    
    for (const resource of resources) {
      for (const action of resource.availableActions) {
        const permission = await Permission.create({
          resourceId: resource.id,
          action: action,
          name: `${resource.name}:${action}`,
          description: `${action} ${resource.description}`,
          isActive: true,
          scope: 'tenant', // Most permissions are tenant-scoped
          tenantId: null, // Global permission
        })
        permissions.push(permission)
      }
    }

    // Assign permissions to roles
    // Super Admin: All permissions
    await superAdminRole.related('permissions').attach(permissions.map(p => p.id))

    // Admin: Most permissions except super admin specific ones
    const adminPermissions = permissions.filter(p => 
      !p.name.includes('settings:') || p.name === 'settings:read'
    )
    await adminRole.related('permissions').attach(adminPermissions.map(p => p.id))

    // Manager: Business operations permissions
    const managerPermissions = permissions.filter(p => 
      p.name.includes('products:') ||
      p.name.includes('orders:') ||
      p.name.includes('inventory:') ||
      p.name.includes('deliveries:') ||
      p.name.includes('categories:') ||
      p.name.includes('reports:read') ||
      p.name.includes('users:read')
    )
    await managerRole.related('permissions').attach(managerPermissions.map(p => p.id))

    // Employee: Basic operations
    const employeePermissions = permissions.filter(p => 
      p.name.includes(':read') ||
      p.name.includes('orders:update') ||
      p.name.includes('inventory:update') ||
      p.name.includes('deliveries:update')
    )
    await employeeRole.related('permissions').attach(employeePermissions.map(p => p.id))

    // Customer: Limited read permissions
    const customerPermissions = permissions.filter(p => 
      p.name.includes('products:read') ||
      p.name.includes('categories:read') ||
      p.name.includes('orders:read') ||
      p.name.includes('orders:create')
    )
    await customerRole.related('permissions').attach(customerPermissions.map(p => p.id))

    // Delivery Person: Delivery-specific permissions
    const deliveryPermissions = permissions.filter(p => 
      p.name.includes('deliveries:read') ||
      p.name.includes('deliveries:update') ||
      p.name.includes('orders:read')
    )
    await deliveryPersonRole.related('permissions').attach(deliveryPermissions.map(p => p.id))

    console.log('✅ Global roles and permissions created successfully')
    console.log(`📊 Created ${permissions.length} permissions across ${resources.length} resources`)
    console.log('🔐 Role hierarchy: super-admin > admin > manager > employee | customer | delivery-person')
  }
}