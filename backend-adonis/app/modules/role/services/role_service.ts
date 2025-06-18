// import { inject } from '@adonisjs/core'
import Role from '#role/models/role'
import type { CreateRoleDto, UpdateRoleDto, AssignRoleDto } from '#role/types/role'
import User from '#user/models/user'
import { Exception } from '@adonisjs/core/exceptions'

export default class RoleService {
  async createRole(data: CreateRoleDto) {
    const role = await Role.create({
      name: data.name,
      tenantId: data.tenantId ?? null,
    })

    if (data.permissionIds?.length) {
      await role.related('permissions').attach(data.permissionIds)
    }

    await role.load('permissions')

    return role.serialize()
  }

  async updateRole(data: UpdateRoleDto) {
    const role = await Role.findOrFail(data.id)

    await role
      .merge({
        name: data.name,
      })
      .save()

    if (data.permissionIds?.length) {
      await role.related('permissions').sync(data.permissionIds)
    }
    await role.load('permissions')

    return role.serialize()
  }

  async assignRolesToUser(data: AssignRoleDto) {
    const user = await User.findOrFail(data.userId)

    console.log('Data: ' + JSON.stringify(data, null, 3))

    if (!data.roles) {
      // Fetch the predefined user role
      const userRole = await Role.query().where('name', 'user').firstOrFail()

      await user.related('roles').attach([userRole.id])
      return
    }

    // Verify all roles exist and belong to the correct tenant
    const roles = await Role.query().whereIn('id', data.roles)

    // Check if all roles belong to correct tenant or are global
    const invalidRole = roles.find(
      (role) => role.tenantId !== null && role.tenantId !== data.tenantId
    )

    // Check if role belongs to correct tenant or is global
    if (invalidRole) {
      throw new Exception('Invalid role for tenant', {
        status: 403,
        code: 'INVALID_ROLE',
      })
    }

    // Sync the user roles
    await user.related('roles').sync(data.roles)
  }

  async listRoles(tenantId?: any) {
    return await Role.query()
      .where((query) => {
        query.whereNull('tenant_id').orWhere('tenant_id', tenantId)
      })
      .preload('permissions', (query) => {
        query.select('resource', 'action')
      })
  }

  async getRole(roleId: number, tenantId: number) {
    const roles = await Role.query()
      .where('id', roleId)
      .where((query) => {
        query.whereNull('tenant_id').orWhere('tenant_id', tenantId)
      })
      .select('id', 'name', 'tenant_id')
      .preload('permissions', (query) => {
        query.select('resource', 'action')
      })
      .firstOrFail()

    return roles
  }
  async getUserRoles(userId: number, tenantId: number) {
    // return await User.related('roles').query()
    //   .where('user_id', userId)
    //   .where('tenant_id', tenantId)
    //   .preload('role', (query) => {
    //     query.preload('permissions')
    //   })
  }

  async deleteRole(roleId: number, tenantId: number) {
    const role = await Role.query()
      .where('id', roleId)
      .where((query) => {
        query.whereNull('tenant_id').orWhere('tenant_id', tenantId)
      })
      .first()

    if (!role) {
      throw new Exception('Role not found', {
        status: 404,
        code: 'ROLE_NOT_FOUND',
      })
    }

    await role.delete()
  }
}
