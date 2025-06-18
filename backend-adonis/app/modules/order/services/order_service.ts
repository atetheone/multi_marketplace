import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'
import Order from '#order/models/order'
import OrderItem from '#order/models/order_item'
import Product from '#product/models/product'
import { CartService } from '#cart/services/cart_service'
import AddressService from '#address/services/address_service'
import { CreateOrderDto, OrderItemDto, UpdateOrderStatusDto } from '#order/types/order'
import { NotificationService } from '#notification/services/notification_service'
import { InventoryService } from '#product/services/inventory_service'
import { NotificationRolesService } from '#notification/services/notification_roles_service'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

@inject()
export class OrderService {
  constructor(
    protected cartService: CartService,
    protected addressService: AddressService,
    protected notificationService: NotificationService,
    protected inventoryService: InventoryService,
    protected notificationRolesService: NotificationRolesService
  ) {}

  async createOrderFromCart(userId: number, tenantId: number, orderData: CreateOrderDto) {
    const trx = await db.transaction()
    let cart
    try {
      cart = await this.cartService.getUserCartById(orderData.cartId, userId, tenantId)
      // Validate and reserve inventory for all items first
      console.log('Cart: ' + JSON.stringify(cart, null, 2))
      for (const item of cart.items) {
        await this.inventoryService.reserveStock(item.product.id, item.quantity, tenantId)
      }

      const shippingAddress = await this.handleShippingAddress(
        userId,
        tenantId,
        orderData.shippingAddress,
        trx
      )

      if (!cart.items?.length) {
        throw new Exception('Cart is empty', {
          status: 400,
          code: 'EMPTY_CART',
        })
      }

      const orderItems = cart.items.map((item: any) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
      }))

      const deliveryFee = shippingAddress.zone.fee
      const { subtotal, total } = await this.calculateOrderTotal(orderItems, tenantId, deliveryFee)

      const order = await Order.create(
        {
          userId,
          tenantId,
          addressId: shippingAddress.id,
          status: 'pending',
          subtotal,
          deliveryFee,
          total,
          paymentMethod: orderData.paymentMethod,
        },
        { client: trx }
      )

      await this.createOrderItems(order.id, orderItems, trx)
      await cart.merge({ status: 'ordered' }).save()

      await order.load((loader) => {
        loader.load('items', (itemsQuery) => {
          itemsQuery.preload('product')
        })
        loader.load('shippingAddress')
        loader.load('user')
      })

      await this.sendNotifications(order, orderItems, total)

      await trx.commit()
      return order
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }

  async updateOrderStatus(orderId: number, tenantId: number, data: UpdateOrderStatusDto) {
    const trx = await db.transaction()

    try {
      const order = await Order.query()
        .where('id', orderId)
        .where('tenant_id', tenantId)
        .preload('user')
        .preload('items')
        .first()

      if (!order) {
        throw new Exception('Order not found', {
          status: 404,
          code: 'ORDER_NOT_FOUND',
        })
      }

      const previousStatus = order.status

      // Handle inventory changes and validate transition
      await this.handleInventoryChange(order, data.status, previousStatus, tenantId)
    
      // Update status
      await order.merge({ status: data.status }).save()

      // Reload order relations
      await order.load((loader) => {
        loader.load('items', (itemsQuery) => {
          itemsQuery.preload('product')
        })
      })

      // Send notifications
      await this.sendStatusNotifications(order, previousStatus)

      await trx.commit()
      return order
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }

  private async handleShippingAddress(
    userId: number,
    tenantId: number,
    addressData: CreateOrderDto['shippingAddress'],
    trx?: TransactionClientContract
  ) {
    return await this.addressService.createAddress(
      userId,
      tenantId,
      {
        ...addressData,
        type: 'shipping',
        isDefault: addressData.isDefault ?? false,
      },
      trx
    )
  }

  private async calculateOrderTotal(items: OrderItemDto[], tenantId: number, deliveryFee: number) {
    let subtotal = 0

    // Validate products and calculate subtotal
    for (const orderItem of items) {
      const product = await Product.query().where('id', orderItem.productId).firstOrFail()

      subtotal += Number(orderItem.unitPrice) * orderItem.quantity
    }
    const formattedSubtotal = Number(subtotal.toFixed(2))
    const formattedDeliveryFee = Number(Number(deliveryFee).toFixed(2))

    // const tax = subtotal * 0.18 // 18% tax
    // const shipping = 1000 // Fixed shipping cost
    const total = Number((formattedSubtotal + formattedDeliveryFee).toFixed(2))
    return { subtotal: formattedSubtotal, total }
  }

  private async createOrderItems(
    orderId: number,
    items: OrderItemDto[],
    trx?: TransactionClientContract
  ) {
    for (const item of items) {
      await OrderItem.create(
        {
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
        },
        { client: trx }
      )
    }
  }

  async getUserOrders(userId: number, tenantId: number) {
    return Order.query()
      .where('user_id', userId)
      .where('tenant_id', tenantId)
      .preload('items', (query) => {
        query.preload('product')
      })
      .orderBy('created_at', 'desc')
  }

  async getOrderById(orderId: number, tenantId: number) {
    const order = await Order.query()
      .where('id', orderId)
      .where('tenant_id', tenantId)
      .preload('items', (query) => {
        query.preload('product')
      })
      .preload('shippingAddress', (adQuery) => {
        adQuery.preload('zone')
      })
      .firstOrFail()

    return order
  }

  async getTenantOrders(tenantId: number, page = 1, limit = 10) {
    return Order.query()
      .where('tenant_id', tenantId)
      .preload('items', (query) => {
        query.preload('product')
      })
      .preload('shippingAddress', (query) => {
        query.preload('zone')
      })
      .preload('user')
      .orderBy('created_at', 'desc')
  }

  async getPendingOrders(tenantId: number) {
    return Order.query()
      .where('tenant_id', tenantId)
      .where('status', 'pending')
      .preload('items', (query) => {
        query.preload('product')
      })
      .preload('shippingAddress', (query) => {
        query.preload('zone')
      })
      .preload('user')
      .orderBy('created_at', 'desc')
  }

  private async handleInventoryChange(
    order: Order,
    newStatus: string,
    previousStatus: string,
    tenantId: number
  ) {
    // Handle cancellations
    if (newStatus === 'cancelled') {
      if (previousStatus === 'shipped' || previousStatus === 'delivered') {
        // TODO: Implement return process
        throw new Exception('Cannot cancel shipped/delivered orders', {
          status: 400,
          code: 'INVALID_CANCELLATION',
        })
      }
      // Release reserved stock if not shipped
      for (const item of order.items) {
        await this.inventoryService.releaseReservedStock(item.productId, item.quantity, tenantId)
      }
      return
    }

    // Handle shipping
    if (newStatus === 'shipped' && previousStatus !== 'shipped') {
      for (const item of order.items) {
        await this.inventoryService.commitReservedStock(item.productId, item.quantity, tenantId)
      }
      return
    }

    // Handle status transitions validation
    const validTransitions: { [key: string]: string[] } = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    }

    if (!validTransitions[previousStatus]?.includes(newStatus)) {
      throw new Exception(`Invalid status transition from ${previousStatus} to ${newStatus}`, {
        status: 400,
        code: 'INVALID_STATUS_TRANSITION',
      })
    }
  }

  private async sendNotifications(order: Order, orderItems: OrderItemDto[], total: number) {
    // Customer notification
    await this.notificationService.createNotification({
      type: 'order:created',
      title: 'Order Confirmation',
      message: `Your order #${order.id} has been placed successfully`,
      userId: order.userId,
      tenantId: order.tenantId,
      data: {
        orderId: order.id,
        total: order.total,
        items: orderItems,
      },
    })

    // Staff notification
    await this.notificationRolesService.notifyRoles({
      type: 'order:created',
      title: 'New Order Received',
      message: `New order #${order.id} has been placed for ${total} FCFA`,
      tenantId: order.tenantId,
      data: {
        orderId: order.id,
        total: order.total,
        items: orderItems,
        customer: {
          id: order.userId,
          name: order.user.username,
        },
      },
    })
  }

  private async sendStatusNotifications(order: Order, previousStatus: string) {
    const statusMessages = {
      pending: 'Your order is pending',
      processing: 'Your order is being prepared',
      shipped: 'Your order has been shipped',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled',
    }

    await this.notificationService.createNotification({
      type: 'order:status_updated',
      title: 'Order Status Updated',
      message: statusMessages[order.status] || `Order #${order.id} status updated to ${order.status}`,
      userId: order.userId,
      tenantId: order.tenantId,
      data: {
        orderId: order.id,
        status: order.status,
        previousStatus,
        total: order.total,
      },
    })

    if (previousStatus !== order.status) {
      await this.notificationRolesService.notifyRoles({
        type: 'order:status_updated',
        title: 'Order Status Changed',
        message: `Order #${order.id} status changed from ${previousStatus} to ${order.status}`,
        tenantId: order.tenantId,
        data: {
          orderId: order.id,
          status: order.status,
          previousStatus,
          customer: {
            id: order.userId,
            username: order.user.username,
          },
        },
      })
    }
  }
}
