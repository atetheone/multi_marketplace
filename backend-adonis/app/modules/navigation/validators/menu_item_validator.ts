import vine from '@vinejs/vine'

export const createMenuItemValidator = vine.compile(
  vine.object({
    label: vine.string().trim(),
    route: vine.string().trim(),
    parentId: vine.number().optional(),
    order: vine.number().optional(),
    icon: vine.string().optional(),
    isActive: vine.boolean().optional(),
    isInternal: vine.boolean().optional(),
    requiredPermissions: vine.array(vine.number()).optional(),
  })
)

export const updateMenuItemValidator = vine.compile(
  vine.object({
    label: vine.string().trim().optional(),
    route: vine.string().trim().optional(),
    parentId: vine.number().optional(),
    order: vine.number().optional(),
    isActive: vine.boolean().optional(),
    isInternal: vine.boolean().optional(),
    requiredPermissions: vine.array(vine.number()).optional(),
  })
)
