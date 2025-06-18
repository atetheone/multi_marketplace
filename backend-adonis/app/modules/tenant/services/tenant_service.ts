import Tenant from '#tenant/models/tenant'
import { Exception } from '@adonisjs/core/exceptions'
import { CreateTenantDto, UpdateTenantDto } from '#tenant/types/tenant'

export default class TenantService {
  async createTenant(tenant: CreateTenantDto) {
    // check if the domain is taken
    const domainTaken = await Tenant.findBy('slug', tenant.slug)

    if (domainTaken) return false

    const newTenant = await Tenant.create({
      name: tenant.name,
      domain: tenant.domain,
      slug: tenant.slug,
      status: tenant.status ?? 'pending',
    })

    return newTenant
  }

  async listTenants() {
    return await Tenant.all()
  }

  async getTenant(tenantId: number) {
    const tenant = await Tenant.findOrFail(tenantId)
    return tenant
  }

  async updateTenant(data: UpdateTenantDto) {
    const tenant = await Tenant.findOrFail(data.id)

    await tenant
      .merge({
        name: data.name,
        domain: data.domain,
        status: data.status,
      })
      .save()

    return tenant
  }

  async deleteTenant(tenantId: number) {
    const tenant = await Tenant.findOrFail(tenantId)
    await tenant.delete()
  }
}
