import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DeliveryPersonService } from '#deliveries/services/delivery_person_service'
import { ApiResponse } from '#utils/api_response'
import {
  createDeliveryPersonValidator,
  updateZonesValidator,
  updateAvailabilityValidator,
  updateDeliveryPersonValidator,
} from '#deliveries/validators/delivery_person_validator'

@inject()
export default class DeliveryPersonController {
  constructor(protected deliveryPersonService: DeliveryPersonService) {}

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createDeliveryPersonValidator)
    const deliveryPerson = await this.deliveryPersonService.createDeliveryPerson(
      data.userId,
      request.tenant.id,
      data
    )
    return ApiResponse.created(response, 'Delivery person created successfully', deliveryPerson)
  }

  async updateZones({ auth, request, response }: HttpContext) {
    const { zoneIds } = await request.validateUsing(updateZonesValidator)
    const deliveryPerson = await this.deliveryPersonService.updateZones(auth.user!.id, zoneIds)
    return ApiResponse.success(response, 'Zones updated successfully', deliveryPerson)
  }

  async updateMyZones({ request, auth, response }: HttpContext) {
    const { zoneIds } = await request.validateUsing(updateZonesValidator)
    const deliveryPerson = await this.deliveryPersonService.updateDeliveryPersonZones(
      auth.user!.id,
      zoneIds
    )
    return ApiResponse.success(response, 'Zones updated successfully', deliveryPerson)
  }

  async toggleAvailability({ request, auth, response }: HttpContext) {
    const { isAvailable } = await request.validateUsing(updateAvailabilityValidator)
    const deliveryPerson = await this.deliveryPersonService.toggleAvailability(
      auth.user!.id,
      isAvailable
    )
    return ApiResponse.success(response, 'Availability updated successfully', deliveryPerson)
  }

  async getMyProfile({ auth, response }: HttpContext) {
    const profile = await this.deliveryPersonService.getDeliveryPersonProfile(auth.user!.id)
    return ApiResponse.success(response, 'Profile retrieved successfully', profile)
  }

  async show({ params, response }: HttpContext) {
    const deliveryPerson = await this.deliveryPersonService.getDeliveryPerson(params.id)
    return ApiResponse.success(response, 'Delivery person retrieved successfully', deliveryPerson)
  }

  async index({ request, response }: HttpContext) {
    const { zoneId } = request.qs()

    const deliveryPersons = await this.deliveryPersonService.listDeliveryPersons(
      request.tenant.id,
      zoneId
    )
    return ApiResponse.success(response, 'Delivery persons retrieved successfully', deliveryPersons)
  }

  async update({ params, request, response }: HttpContext) {
    // Assuming updateDeliveryPersonValidator should be imported at the top
    const data = await request.validateUsing(updateDeliveryPersonValidator)
    const deliveryPerson = await this.deliveryPersonService.updateDeliveryPerson(
      params.id,
      request.tenant.id,
      data
    )
    return ApiResponse.success(response, 'Delivery person updated successfully', deliveryPerson)
  }
}
