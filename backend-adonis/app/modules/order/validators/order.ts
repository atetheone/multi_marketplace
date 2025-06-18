import vine from '@vinejs/vine'

export const createOrderValidator = vine.compile(
  vine.object({
    cartId: vine.number().positive(),
    shippingAddress: vine.object({
      addressLine1: vine.string().trim(),
      addressLine2: vine.string().trim().optional(),
      city: vine.string().trim(),
      country: vine.string().trim(),
      phone: vine.string().trim().optional(),
      postalCode: vine.string().trim().optional(),
      zoneId: vine.number().positive(),
    }),
    paymentMethod: vine.string().trim(),
  })
)

export const updateOrderStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']),
  })
)

export const updateOrderPaymentStatusValidator = vine.compile(
  vine.object({
    paymentStatus: vine.enum(['pending', 'paid', 'failed', 'refunded']),
  })
)
