import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CartService } from '#cart/services/cart_service'
import { addCartItemValidator, updateCartItemValidator } from '#cart/validators/cart'
import { ApiResponse } from '#utils/api_response'

@inject()
export default class CartItemController {
  constructor(protected cartService: CartService) {}

  async store({ request, params, auth, response }: HttpContext) {
    const tenant = request.tenant
    const item = await request.validateUsing(addCartItemValidator)
    await this.cartService.addItemsToCart(params.cartId, auth.user!.id, tenant.id, [item])

    const updatedCart = await this.cartService.getUserCartById(
      params.cartId,
      auth.user!.id,
      tenant.id
    )

    return ApiResponse.success(response, 'Items added to cart successfully', updatedCart)
  }

  async update({ request, auth, params, response }: HttpContext) {
    const tenant = request.tenant
    const data = await request.validateUsing(updateCartItemValidator)

    const cartItem = await this.cartService.updateCartItem(
      params.itemId,
      data,
      auth.user!.id,
      tenant.id
    )
    return ApiResponse.success(response, 'Cart item updated successfully', cartItem)
  }

  async destroy({ params, auth, request, response }: HttpContext) {
    const tenant = request.tenant
    await this.cartService.removeCartItem(params.itemId, auth?.user.id, tenant.id)
    return ApiResponse.success(response, 'Item removed from cart successfully')
  }
}
