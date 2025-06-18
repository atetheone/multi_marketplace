import vine from '@vinejs/vine'

const userBase = {
  email: vine.string().trim().email(),
  username: vine.string().trim().minLength(3),
  firstName: vine.string().trim().minLength(3),
  lastName: vine.string().trim().minLength(3),
  roles: vine.array(vine.number().min(1)),
}

export const createUserValidator = vine.compile(
  vine.object({
    ...userBase,
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    id: vine.number(),
    ...userBase,
  })
)

export const updateProfileValidator = vine.compile(
  vine.object({
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
    bio: vine.string().optional(),
    phone: vine.string().optional(),
    website: vine.string().optional(),
  })
)
