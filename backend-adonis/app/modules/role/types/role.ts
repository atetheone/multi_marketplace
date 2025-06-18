import { PermissionDto } from './permission.js'

export enum Role {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
}

export interface RoleDto {
  name: string
  permissions: PermissionDto[]
}

export interface AssignRoleDto {
  userId: number
  tenantId: number
  roles: number[]
}

export interface CreateRoleDto {
  name: string
  permissionIds: number[]
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {
  id: number
}
