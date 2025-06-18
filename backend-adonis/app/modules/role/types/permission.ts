export interface PermissionDto {
  action: string
  resource: string
}

export interface CreatePermissionDto {
  scope: 'all' | 'own' | 'dept' | 'tenant'
  action: string
  resource?: string
  resourceId: number
  tenantId?: number
}

export interface UpdatePermissionDto extends Partial<CreatePermissionDto> {
  id: number
}
