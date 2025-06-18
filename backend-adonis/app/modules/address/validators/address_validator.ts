import vine from '@vinejs/vine'

const addressBase = {
  type: vine.enum(['shipping', 'billing']),
  addressLine1: vine.string().trim(),
  addressLine2: vine.string().trim().optional(),
  city: vine.string().trim(),
  state: vine.string().trim().optional(),
  country: vine.string().trim(),
  postalCode: vine.string().trim().optional(),
  phone: vine.string().trim().optional(),
  isDefault: vine.boolean().optional(),
}

export const createAddressValidator = vine.compile(
  vine.object({
    ...addressBase,
  })
)

export const updateAddressValidator = vine.compile(
  vine.object({
    type: vine.enum(['shipping', 'billing']).optional(),
    addressLine1: vine.string().trim().optional(),
    addressLine2: vine.string().trim().optional(),
    city: vine.string().trim().optional(),
    state: vine.string().trim().optional(),
    country: vine.string().trim().optional(),
    postalCode: vine.string().trim().optional(),
    phone: vine.string().trim().optional(),
    isDefault: vine.boolean().optional(),
  })
)
