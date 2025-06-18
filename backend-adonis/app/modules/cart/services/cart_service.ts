import Cart from '#cart/models/cart'
import CartItem from '#cart/models/cart_item'
import Product from '#product/models/product'
import { CreateCartDto, CartItemDto, UpdateCartItemDto } from '#cart/types/cart'
import { Exception } from '@adonisjs/core/exceptions'

export class CartService {
  async getCurrentUserCart(userId: number, tenantId: number) {
    const cart = await Cart.query()
      .where('user_id', userId)
      .where('tenant_id', tenantId)
      .where('status', 'active')
      .preload('items', (query) => {
        query.preload('product', (productQuery) => {
          productQuery.preload('inventory')
        })
      })
      .orderBy('created_at', 'desc')
      .firstOrFail()

    return cart
  }

  async getUserCarts(userId: number, tenantId: number) {
    const carts = await this.filterByUser(this.baseCartQuery(), userId, tenantId)

    return carts
  }

  async getUserActiveCarts(userId: number, tenantId: number) {
    const carts = await this.filterByUser(this.baseCartQuery(), userId, tenantId).where(
      'status',
      'active'
    )

    return carts
  }
  async getUserCartById(cartId: number, userId: number, tenantId: number) {
    const cart = await this.filterByUser(this.baseCartQuery(), userId, tenantId)
      .where('id', cartId)
      .firstOrFail()

    return cart
  }

  async createCart(cartDto: CreateCartDto) {
    const existingCart = await Cart.query()
      .where('user_id', cartDto.userId)
      .where('tenant_id', cartDto.tenantId)
      .where('status', 'active')
      .first()

    if (existingCart) {
      if (cartDto.items?.length) {
        await this.addItemsToCart(existingCart.id, cartDto.userId, cartDto.tenantId, cartDto.items)
      }

      await existingCart.load('items', (query) => {
        query.preload('product', (productQuery) => {
          productQuery.preload('inventory')
        })
      })

      return existingCart
    }

    const cart = await Cart.create({
      userId: cartDto.userId,
      tenantId: cartDto.tenantId,
      status: 'active',
    })
    if (cartDto.items?.length) {
      await this.addItemsToCart(cart.id, cartDto.userId, cartDto.tenantId, cartDto.items)
    }

    await cart.load('items', (query) => {
      query.preload('product', (productQuery) => {
        productQuery.preload('inventory')
      })
    })

    return cart
  }

  async addItemsToCart(cartId: number, userId: number, tenantId: number, items: CartItemDto[]) {
    const cart = await this.getUserCartById(cartId, userId, tenantId)

    for (const item of items) {
      // Verify product exists and belongs to tenant
      const product = await Product.query()
        .where('id', item.productId)
        .where('is_active', true)
        .where('is_marketplace_visible', true)
        .preload('inventory')
        .firstOrFail()

      const existingItem = await CartItem.query()
        .where('cart_id', cart.id)
        .where('product_id', item.productId)
        .first()

      if (existingItem) {
        await existingItem
          .merge({
            quantity: existingItem.quantity + item.quantity,
          })
          .save()
      } else {
        await CartItem.create({
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
          tenantId: product.tenantId,
        })
      }
    }
  }

  async updateCartItem(itemId: number, data: UpdateCartItemDto, userId: number, tenantId: number) {
    const cartItem = await CartItem.query()
      .whereHas('cart', (query) => {
        query.where('tenant_id', tenantId).where('user_id', userId)
      })
      .where('id', itemId)
      .preload('product', (query) => {
        query.preload('inventory')
      })
      .firstOrFail()

    await cartItem.merge({ quantity: data.quantity }).save()

    return cartItem
  }

  async removeCartItem(itemId: number, userId: number, tenantId: number) {
    const cartItem = await CartItem.query()
      .whereHas('cart', (query) => {
        query.where('tenant_id', tenantId).where('user_id', userId)
      })
      .where('id', itemId)
      .firstOrFail()

    await cartItem.delete()
  }

  async clearCart(cartId: number, userId: number, tenantId: number) {
    const cart = await this.getUserCartById(cartId, userId, tenantId)
    await CartItem.query().where('cart_id', cart.id).delete()
  }

  async deleteCart(cartId: number, userId: number, tenantId: number) {
    const cart = await this.getUserCartById(cartId, userId, tenantId)
    await cart.delete()
  }

  private baseCartQuery() {
    return Cart.query()
      .preload('items', (query) => {
        query.preload('product', (productQuery) => {
          productQuery.preload('inventory')
        })
      })
      .orderBy('created_at', 'desc')
  }

  private filterByUser(query: any, userId: number, tenantId: number) {
    return query.where('user_id', userId).where('tenant_id', tenantId)
  }
}
