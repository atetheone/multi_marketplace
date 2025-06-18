import vine from '@vinejs/vine'

export const assignDeliveryValidator = vine.compile(
  vine.object({
    orderId: vine.number(),
    deliveryPersonId: vine.number(),
    notes: vine.string().optional(),
  })
)

export const updateDeliveryStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['pending', 'shipped', 'delivered', 'returned', 'cancelled']),
    notes: vine.string().optional(),
  })
)
