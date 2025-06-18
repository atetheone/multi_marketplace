import vine from '@vinejs/vine'

export const createDeliveryPersonValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    vehicleType: vine.enum(['motorcycle', 'bicycle', 'car', 'van']),
    vehiclePlateNumber: vine.string(),
    vehicleModel: vine.string().optional(),
    vehicleYear: vine.number().optional(),
    licenseNumber: vine.string(),
    licenseExpiry: vine.date(),
    licenseType: vine.string().optional(),
  })
)

export const updateZonesValidator = vine.compile(
  vine.object({
    zoneIds: vine.array(vine.number()),
  })
)

export const updateAvailabilityValidator = vine.compile(
  vine.object({
    isAvailable: vine.boolean(),
  })
)

export const updateDeliveryPersonValidator = vine.compile(
  vine.object({
    vehicleType: vine.enum(['motorcycle', 'bicycle', 'car', 'van']),
    vehiclePlateNumber: vine.string(),
    vehicleModel: vine.string().optional(),
    vehicleYear: vine.number().optional(),
    licenseNumber: vine.string(),
    licenseExpiry: vine.date(),
    licenseType: vine.string().optional(),
    zoneIds: vine.array(vine.number()).optional(),
  })
)
