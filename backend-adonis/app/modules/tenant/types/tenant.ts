export interface TenantDto {
  name: string
  domain: string
  description?: string
  slug: string
  status?: 'active' | 'inactive' | 'suspended' | 'pending'
}

export interface CreateTenantDto extends TenantDto {}

export interface UpdateTenantDto extends CreateTenantDto {}
