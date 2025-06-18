export interface CreateResourceDto {
  name: string
  description: string
  availableActions: string[]
  tenantId?: number
}

export interface UpdateResourceDto {
  description?: string
  availableActions?: string[]
  isActive?: boolean
}
