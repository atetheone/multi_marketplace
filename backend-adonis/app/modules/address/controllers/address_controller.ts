import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import AddressService from '#address/services/address_service'
import { ApiResponse } from '#utils/api_response'
import {
  createAddressValidator,
  updateAddressValidator,
} from '#address/validators/address_validator'

@inject()
export default class AddressController {
  constructor(protected addressService: AddressService) {}

  async index({ auth, request, response }: HttpContext) {
    const addresses = await this.addressService.getUserAddresses(auth.user!.id, request.tenant.id)
    return ApiResponse.success(response, 'Addresses retrieved successfully', addresses)
  }

  async show({ params, auth, request, response }: HttpContext) {
    const address = await this.addressService.getAddressById(
      params.id,
      auth.user!.id,
      request.tenant.id
    )
    return ApiResponse.success(response, 'Address retrieved successfully', address)
  }

  async getDefaultShipping({ auth, request, response }: HttpContext) {
    const address = await this.addressService.getDefaultShippingAddress(
      auth.user!.id,
      request.tenant.id
    )
    return ApiResponse.success(response, 'Default shipping address retrieved', address)
  }

  async store({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(createAddressValidator)
    const address = await this.addressService.createAddress(auth.user!.id, request.tenant.id, data)
    return ApiResponse.created(response, 'Address created successfully', address)
  }

  async update({ params, request, auth, response }: HttpContext) {
    const data = await request.validateUsing(updateAddressValidator)
    const address = await this.addressService.updateAddress(
      params.id,
      auth.user!.id,
      request.tenant.id,
      data
    )
    return ApiResponse.success(response, 'Address updated successfully', address)
  }

  async destroy({ params, auth, request, response }: HttpContext) {
    await this.addressService.deleteAddress(params.id, auth.user!.id, request.tenant.id)
    return ApiResponse.success(response, 'Address deleted successfully')
  }
}
