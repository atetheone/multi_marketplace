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

  async getDeliveries(tenantId?: number) {
    let query = Delivery.query()
      .preload('order', (orderQuery) => {
        orderQuery.preload('shippingAddress')
      })
      .preload('deliveryPerson')

    // TODO: Re-enable tenant filtering after adding tenant_id column
    // if (tenantId !== undefined && tenantId !== null) {
    //   query = query.where('tenant_id', tenantId)
    // }

    const deliveries = await query
    return deliveries
  }

  async assignDelivery(orderId: number, deliveryPersonId: number, notes: string, tenantId: number) {
    // Start a transaction
    const trx = await db.transaction()

    try {
      // Get order with shipping info
      const order = await Order.query({ client: trx })
        .where('id', orderId)
        .where('tenant_id', tenantId)
        .whereIn('status', ['processing', 'pending'])
        .preload('shippingAddress', (query) => query.preload('zone'))
        .firstOrFail()

      // Verify the delivery person exists and belongs to tenant
      // Note: deliveryPersonId is actually the user_id from frontend
      const deliveryPerson = await DeliveryPerson.query({ client: trx })
        .where('user_id', deliveryPersonId)
        .where('tenant_id', tenantId)
        .where('is_active', true)
        .firstOrFail()

      // Check if delivery person is available (not already assigned)
      const existingDelivery = await Delivery.query({ client: trx })
        .where('delivery_person_id', deliveryPerson.id) // FIX: Use actual delivery_person.id
        .whereNull('delivered_at')
        .first()

      if (existingDelivery) {
        throw new Exception('Delivery person is already assigned to another delivery', {
          status: 400,
          code: 'DELIVERY_PERSON_BUSY',
        })
      }

      // Create delivery assignment
      const newDelivery = await Delivery.create(
        {
          orderId,
          deliveryPersonId: deliveryPerson.id, // FIX: Use actual delivery_person.id
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
        userId: deliveryPerson.userId, // FIX: Use delivery person's userId
        tenantId: order.tenantId,
        data: {
          orderId: order.id,
          deliveryId: newDelivery.id,
        },
      })

      await trx.commit()
      return newDelivery
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async updateDeliveryStatus(
    deliveryId: number,
    status: 'pending' | 'processing' | 'delivered' | 'cancelled' | 'shipped' | 'returned',
    tenantId: number,
    notes?: string
  ) {
    const delivery = await Delivery.query()
      .where('id', deliveryId)
      // TODO: Re-enable tenant filtering after adding tenant_id column
      // .where('tenant_id', tenantId)
      .firstOrFail()
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
