import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { InventoryService } from '#product/services/inventory_service'
import { ApiResponse } from '#utils/api_response'
import {
  updateStockValidator,
  updateInventorySettingsValidator,
} from '#product/validators/inventory'

@inject()
export default class InventoryController {
  constructor(protected inventoryService: InventoryService) {}

  async updateStock({ request, params, response }: HttpContext) {
    const tenant = request.tenant
    const { stock } = await request.validateUsing(updateStockValidator)

    const product = await this.inventoryService.updateStock(params.id, stock, tenant.id)

    return ApiResponse.success(response, 'Product stock updated successfully', product)
  }

  async updateSettings({ request, params, response }: HttpContext) {
    const tenant = request.tenant
    const settings = await request.validateUsing(updateInventorySettingsValidator)
    const product = await this.inventoryService.updateSettings(params.id, settings, tenant.id)

    return ApiResponse.success(response, 'Inventory settings updated successfully', product)
  }

  async getStockHistory({ request, params, response }: HttpContext) {
    const tenant = request.tenant
    const history = await this.inventoryService.getStockHistory(params.id, tenant.id)

    return ApiResponse.success(response, 'Stock history retrieved successfully', history)
  }
}
