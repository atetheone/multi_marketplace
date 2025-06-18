export interface MenuItem {
  id: number
  label: string
  icon?: string
  route?: string
  parentId?: number
  order: number
  isActive: boolean
  isInternal?: boolean
  requiredPermissions?: number[]
  children?: MenuItem[]
}

export interface CreateMenuItemDto {
  label: string
  route: string
  parentId?: number
  order?: number
  icon?: string
  isActive?: boolean
  isInternal?: boolean
  requiredPermissions?: number[]
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {}
