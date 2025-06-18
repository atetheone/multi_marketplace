import { inject } from '@adonisjs/core'
import Delivery from '#deliveries/models/delivery'
import Order from '#order/models/order'
import User from '#user/models/user'
import { NotificationService } from '#notification/services/notification_service'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import DeliveryPerson from '#deliveries/models/delivery_person'

@inject()
export class DeliveryService {
  constructor(protected notificationService: NotificationService) {}

  async getDeliveries() {
    const deliveries = await Delivery.query().preload('order', (orderQuery) => {
      orderQuery.preload('shippingAddress')
    })

    return deliveries
  }

  async assignDelivery(orderId: number, deliveryPersonId: number, notes: string) {
    // Start a transaction
    const trx = await db.transaction()
    // Get order with shipping info
    const order = await Order.query({ client: trx })
      .where('id', orderId)
      .whereIn('status', ['processing', 'pending'])
      .preload('shippingAddress', (query) => query.preload('zone'))
      .firstOrFail()

    // Verify the user is a delivery person
    const deliveryPerson = await User.query({ client: trx })
      .where('id', deliveryPersonId)
      // .preload('roles', (query) => {
      //   query.where('name', 'delivery-person')
      // })
      .firstOrFail()

    // if (!deliveryPerson.roles.length) {
    //   throw new Exception('User is not a delivery person', { status: 400 })
    // }

    // Create delivery assignment
    const newDelivery = await Delivery.create(
      {
        orderId,
        deliveryPersonId,
        assignedAt: DateTime.now(),
        notes,
      },
      { client: trx }
    )

    // Update order status
    await order.merge({ status: 'processing' }).save()

    // Notify delivery person
    await this.notificationService.createNotification({
      type: 'delivery:assigned',
      title: 'New Delivery Assignment',
      message: `You have been assigned to deliver order #${order.id}`,
      userId: deliveryPersonId,
      tenantId: order.tenantId,
      data: {
        orderId: order.id,
        deliveryId: newDelivery.id,
      },
    })

    return newDelivery
  }

  async updateDeliveryStatus(
    deliveryId: number,
    status: 'pending' | 'processing' | 'delivered' | 'cancelled' | 'shipped' | 'returned',
    notes?: string
  ) {
    const delivery = await Delivery.findOrFail(deliveryId)
    const statusUpdateMap: Record<string, string> = {
      delivered: 'deliveredAt',
    }

    await delivery
      .merge({
        notes,
        [statusUpdateMap[status] ?? null]: status === 'delivered' ? DateTime.now() : null,
      })
      .save()

    const order = await Order.findOrFail(delivery.orderId)
    await order.merge({ status }).save()

    // Notify customer
    await this.notificationService.createNotification({
      type: 'delivery:status_updated',
      title: 'Delivery Status Updated',
      message: `Your order #${order.id} ${status === 'delivered' ? 'has been delivered' : 'is being delivered'}`,
      userId: order.userId,
      tenantId: order.tenantId,
      data: {
        orderId: order.id,
        deliveryId: delivery.id,
        status,
      },
    })

    return delivery
  }

  async getDeliveryPersonOrders(tenantId: number, userId: number) {
    const deliveryQuery = await DeliveryPerson.query()
      .where('user_id', userId)
      .where((query) => {
        query.whereNull('tenant_id')
        if (tenantId) {
          query.orWhere('tenant_id', tenantId)
        }
      })
      .firstOrFail()

    const query = Delivery.query()
      .where('delivery_person_id', deliveryQuery.id)
      .preload('order', (orderQuery) => {
        orderQuery.preload('shippingAddress')
      })

    return await query.orderBy('created_at', 'desc')
  }

  async getAvailableDeliveryPersons(zoneId: number) {
    return await User.query()
      .whereHas('roles', (query) => {
        query.where('name', 'delivery-person')
      })
      .preload('roles')
      .orderBy('id', 'asc')
  }

  async getDelivery(id: number) {
    const delivery = await Delivery.query()
      .where('id', id)
      .preload('order')
      .preload('deliveryPerson', (query) => {
        query.preload('user')
      })
      .firstOrFail()

    return delivery
  }
}
