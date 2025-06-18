import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CartService } from '#cart/services/cart_service'
import { ApiResponse } from '#utils/api_response'
import { createCartValidator } from '#cart/validators/cart'
import { CartItemDto } from '#cart/types/cart'

@inject()
export default class CartController {
  constructor(protected cartService: CartService) {}

  async index({ request, auth, response }: HttpContext) {
    const tenant = request.tenant
    const carts = await this.cartService.getUserCarts(auth.user!.id, tenant.id)
    return ApiResponse.success(response, 'Carts retrieved successfully', carts)
  }

  async show({ request, params, auth, response }: HttpContext) {
    const tenant = request.tenant
    const cart = await this.cartService.getUserCartById(params.id, auth.user!.id, tenant.id)

    return ApiResponse.success(response, 'Cart retrieved successfully', cart)
  }

  async getCurrentCart({ request, auth, response }: HttpContext) {
    const tenant = request.tenant
    const cart = await this.cartService.getCurrentUserCart(auth.user!.id, tenant.id)

    return ApiResponse.success(response, 'Cart retrieved successfully', cart)
  }
  async store({ request, auth, response }: HttpContext) {
    const tenant = request.tenant
    const { items }: { items?: CartItemDto[] } = await request.validateUsing(createCartValidator)
    const cart = await this.cartService.createCart({
      userId: auth.user!.id,
      tenantId: tenant.id,
      items,
    })

    return ApiResponse.created(response, 'Cart created successfully', cart)
  }

  async clear({ params, auth, request, response }: HttpContext) {
    const tenant = request.tenant
    await this.cartService.clearCart(params.id, auth.user!.id, tenant.id)

    return ApiResponse.success(response, 'Cart cleared successfully')
  }

  async destroy({ params, auth, request, response }: HttpContext) {
    const tenant = request.tenant
    const user = await auth.user
    const userId = user.id
    await this.cartService.deleteCart(params.id, auth.user!.id, tenant.id)
    return ApiResponse.success(response, 'Cart deleted successfully')
  }
}
