import vine from '@vinejs/vine'

export const updateStockValidator = vine.compile(
  vine.object({
    stock: vine.number().min(0),
  })
)

export const updateInventorySettingsValidator = vine.compile(
  vine.object({
    reorderPoint: vine.number().min(0),
    reorderQuantity: vine.number().min(1),
    lowStockThreshold: vine.number().min(0),
  })
)
