import vine from '@vinejs/vine'

export const createCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    description: vine.string().trim().optional(),
    parent_id: vine.number().optional(),
    is_active: vine.boolean().optional(),
  })
)

export const updateCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    description: vine.string().trim().optional(),
    parent_id: vine.number().optional(),
    is_active: vine.boolean().optional(),
  })
)
