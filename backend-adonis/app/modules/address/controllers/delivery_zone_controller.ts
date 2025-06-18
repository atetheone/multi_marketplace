import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DeliveryZoneService } from '#address/services/delivery_zone_service'
import { ApiResponse } from '#utils/api_response'
import { createZoneValidator, updateZoneValidator } from '#address/validators/zone_validator'

@inject()
export default class DeliveryZoneController {
  constructor(protected zoneService: DeliveryZoneService) {}

  async index({ request, response }: HttpContext) {
    const tenant = request.tenant
    const zones = await this.zoneService.listZones(tenant.id)
    return ApiResponse.success(response, 'Delivery zones retrieved successfully', zones)
  }

  async show({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    const zone = await this.zoneService.getZoneById(params.id, tenant.id)
    return ApiResponse.success(response, 'Delivery zone retrieved successfully', zone)
  }

  async store({ request, response }: HttpContext) {
    const tenant = request.tenant
    const data = await request.validateUsing(createZoneValidator)
    const zone = await this.zoneService.createZone({
      ...data,
      tenantId: tenant.id,
    })
    return ApiResponse.created(response, 'Delivery zone created successfully', zone)
  }

  async update({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    const data = await request.validateUsing(updateZoneValidator)
    const zone = await this.zoneService.updateZone({
      ...data,
      id: params.id,
      tenantId: tenant.id,
    })
    return ApiResponse.success(response, 'Delivery zone updated successfully', zone)
  }

  async destroy({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    await this.zoneService.deleteZone(params.id, tenant.id)
    return ApiResponse.success(response, 'Delivery zone deleted successfully')
  }
}
