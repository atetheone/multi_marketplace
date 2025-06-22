import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DeliveryService } from '#deliveries/services/delivery_service'
import { ApiResponse } from '#utils/api_response'
import {
  assignDeliveryValidator,
  updateDeliveryStatusValidator,
} from '#deliveries/validators/delivery_validator'

@inject()
export default class DeliveryController {
  constructor(protected deliveryService: DeliveryService) {}

  async index({ request, response }: HttpContext) {
    // SECURITY FIX: Extract tenant ID and pass to service
    const tenantId = request.tenant?.id
    const deliveries = await this.deliveryService.getDeliveries(tenantId)

    return ApiResponse.success(response, 'Deliveries retrieved successfully', deliveries)
  }

  async assignDelivery({ request, response }: HttpContext) {
    const data = await request.validateUsing(assignDeliveryValidator)
    const tenantId = request.tenant?.id

    if (!tenantId) {
      return ApiResponse.error(response, 'Tenant context required', 400)
    }

    const delivery = await this.deliveryService.assignDelivery(
      data.orderId,
      data.deliveryPersonId,
      data.notes || '',
      tenantId // SECURITY FIX: Pass tenant ID
    )
    return ApiResponse.success(response, 'Delivery assigned successfully', delivery)
  }

  async updateStatus({ params, request, response }: HttpContext) {
    const { status, notes } = await request.validateUsing(updateDeliveryStatusValidator)
    const tenantId = request.tenant?.id

    if (!tenantId) {
      return ApiResponse.error(response, 'Tenant context required', 400)
    }

    const delivery = await this.deliveryService.updateDeliveryStatus(
      Number(params.id),
      status,
      tenantId, // SECURITY FIX: Pass tenant ID
      notes
    )
    return ApiResponse.success(response, 'Delivery status updated successfully', delivery)
  }

  async getMyDeliveries({ request, auth, response }: HttpContext) {
    const { status } = request.qs()
    const tenantId = request.tenant!.id
    const orders = await this.deliveryService.getDeliveryPersonOrders(tenantId, auth.user!.id)
    return ApiResponse.success(response, 'Orders retrieved successfully', orders)
  }

  async getAvailableDeliveryPersons({ request, response }: HttpContext) {
    const { zoneId } = request.params()
    const deliveryPersons = await this.deliveryService.getAvailableDeliveryPersons(zoneId)
    return ApiResponse.success(response, 'Delivery persons retrieved successfully', deliveryPersons)
  }

  async show({ params, response }: HttpContext) {
    const delivery = await this.deliveryService.getDelivery(params.id)
    return ApiResponse.success(response, 'Delivery retrieved successfully', delivery)
  }
}
