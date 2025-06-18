import vine from '@vinejs/vine'

const stringFormat = vine.string().trim()

export const registerUserValidator = vine.compile(
  vine.object({
    username: stringFormat,
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().trim().minLength(8),
    firstName: stringFormat,
    lastName: stringFormat,
    roles: vine.array(vine.number()).optional(),
  })
)

export const setPasswordValidator = vine.compile(
  vine.object({
    password: vine.string().minLength(6),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
  })
)
