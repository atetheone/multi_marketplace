import vine from '@vinejs/vine'

export const createRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    permissionIds: vine.array(vine.number().min(1)),
  })
)

export const updateRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    permissionIds: vine.array(vine.number().min(1)),
  })
)

export const assignRoleValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    roles: vine.array(vine.number().min(1)),
  })
)
