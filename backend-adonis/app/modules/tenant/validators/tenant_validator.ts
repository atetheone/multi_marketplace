import vine from '@vinejs/vine'

export const createTenantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    domain: vine.string().trim().minLength(3),
    slug: vine.string().trim().minLength(3),
    description: vine.string().trim().optional(),
    status: vine.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
  })
)

export const updateTenantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    domain: vine.string().trim().minLength(3),
    description: vine.string().trim().optional(),
    status: vine.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
  })
)
