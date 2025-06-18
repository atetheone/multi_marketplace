import vine from '@vinejs/vine'

export const createPermissionValidator = vine.compile(
  vine.object({
    resourceId: vine.number(),
    action: vine.string().trim().minLength(3),
    resource: vine.string().trim().optional(),
    scope: vine.enum(['all', 'own', 'dept', 'tenant'] as const).optional(),
  })
)

export const updatePermissionValidator = vine.compile(
  vine.object({
    id: vine.number(),
    action: vine.string().trim().minLength(3),
    resource: vine.string().trim().optional(),
    resourceId: vine.number(),
    scope: vine.enum(['all', 'own', 'dept', 'tenant'] as const).optional(),
  })
)
