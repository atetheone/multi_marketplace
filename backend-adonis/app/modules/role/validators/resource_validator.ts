import vine from '@vinejs/vine'

export const createResourceValidator = vine.compile(
  vine.object({
    name: vine.string().trim().alphaNumeric().toLowerCase(),
    description: vine.string().trim(),
    availableActions: vine.array(vine.string().trim()).minLength(1),
  })
)

export const updateResourceValidator = vine.compile(
  vine.object({
    description: vine.string().trim().optional(),
    availableActions: vine.array(vine.string().trim()).optional(),
    isActive: vine.boolean().optional(),
  })
)
