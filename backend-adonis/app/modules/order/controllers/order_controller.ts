import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { OrderService } from '#order/services/order_service'
import { createOrderValidator, updateOrderStatusValidator } from '#order/validators/order'
import { ApiResponse } from '#utils/api_response'

@inject()
export default class OrderController {
  constructor(protected orderService: OrderService) {}

  async create({ request, auth, response }: HttpContext) {
    const tenant = request.tenant
    const orderBody = await request.validateUsing(createOrderValidator)
    console.log('Order: ' + JSON.stringify(orderBody, null, 2))
    // Get cart and create order
    const order = await this.orderService.createOrderFromCart(auth.user!.id, tenant.id, orderBody)

    return ApiResponse.success(response, 'Order created successfully', order)
  }

  async getUserOrders({ auth, request, response }: HttpContext) {
    const orders = await this.orderService.getUserOrders(auth.user!.id, request.tenant.id)
    return ApiResponse.success(response, 'Orders retrieved successfully', orders)
  }

  async show({ params, request, response }: HttpContext) {
    const order = await this.orderService.getOrderById(params.id, request.tenant.id)
    return ApiResponse.success(response, 'Order retrieved successfully', order)
  }

  async updateStatus({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateOrderStatusValidator)
    const order = await this.orderService.updateOrderStatus(params.id, request.tenant.id, data)
    return ApiResponse.success(response, 'Order status updated successfully', order)
  }

  async cancel({ params, auth, request, response }: HttpContext) {
    const order = await this.orderService.updateOrderStatus(params.id, request.tenant.id, {
      status: 'cancelled',
    })

    return ApiResponse.success(response, 'Order cancelled successfully', order)
  }

  async getTenantOrders({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const orders = await this.orderService.getTenantOrders(request.tenant.id, page, limit)
    return ApiResponse.success(response, 'Orders retrieved successfully', orders)
  }

  async getPendingOrders({ request, response}: HttpContext) {
    const pendingOrders = await this.orderService.getPendingOrders(request.tenant.id)
    return ApiResponse.success(response, 'Orders retrieved successfully', pendingOrders)
 
  }
}
