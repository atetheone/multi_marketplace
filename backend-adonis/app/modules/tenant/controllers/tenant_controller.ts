import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import TenantService from '#tenant/services/tenant_service'
import { createTenantValidator, updateTenantValidator } from '#tenant/validators/tenant_validator'
import { CreateTenantDto, UpdateTenantDto } from '#tenant/types/tenant'
import { ApiResponse } from '#utils/api_response'

@inject()
export default class TenantController {
  constructor(protected tenantService: TenantService) {}

  // Create a new tenant
  async create({ request, response }: HttpContext) {
    const data: CreateTenantDto = await request.validateUsing(createTenantValidator)
    const tenant = await this.tenantService.createTenant(data)

    if (!tenant) {
      return ApiResponse.error(response, 'Slug taken', 409)
    }
    return ApiResponse.created(response, 'Tenant created successfully', tenant)
  }

  // List all tenants
  async index({ response }: HttpContext) {
    const tenants = await this.tenantService.listTenants()

    return ApiResponse.success(response, 'Tenants retrieved successfully', tenants)
  }

  // Get details of a specific tenant
  async show({ params, response }: HttpContext) {
    const tenant = await this.tenantService.getTenant(params.id)

    return ApiResponse.success(response, 'Tenant retrieved successfully', tenant)
  }
  // router.get(':id/products', [TenantController, 'getTenantProducts']).use(middleware.permission(['read:tenants']))
  async getTenantProducts({ request, params, response }: HttpContext) {
    const products = await this.tenantService.getTenantProducts(params.id)

    return ApiResponse.success(response, 'Tenant products retrieved successfully')
  }
  // router.get(':id/products/:productId', [TenantController, 'getProductDetails']).use(middleware.permission(['read:tenants']))

  // Update an existing tenant
  async update({ request, params, response }: HttpContext) {
    const data: UpdateTenantDto = await request.validateUsing(updateTenantValidator)
    const tenant = await this.tenantService.updateTenant({
      ...data,
      id: params.id,
    })

    return ApiResponse.success(response, 'Tenant updated successfully', tenant)
  }

  // Delete a tenant
  async destroy({ request, params, response }: HttpContext) {
    const tenant = request.tenant
    if (params.id === tenant.id) {
      return ApiResponse.error(response, 'Tenant cannot be deleted')
    }
    await this.tenantService.deleteTenant(params.id, tenant.id)
    return ApiResponse.success(response, 'Tenant deleted successfully')
  }
}
