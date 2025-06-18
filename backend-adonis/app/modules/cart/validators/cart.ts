import vine from '@vinejs/vine'

export const addCartItemValidator = vine.compile(
  vine.object({
    productId: vine.number().positive(),
    quantity: vine.number().positive().min(1),
  })
)

export const createCartValidator = vine.compile(
  vine.object({
    items: vine
      .array(
        vine.object({
          productId: vine.number().positive(),
          quantity: vine.number().positive().min(1),
        })
      )
      .optional(),
  })
)

export const updateCartItemValidator = vine.compile(
  vine.object({
    quantity: vine.number().positive().min(1),
  })
)
