import vine from '@vinejs/vine'

const zoneBase = {
  name: vine.string().trim().minLength(3).maxLength(100),
  fee: vine.number().positive()
}

export const createZoneValidator = vine.compile(
  vine.object({
    ...zoneBase
  })
)

export const updateZoneValidator = vine.compile(
  vine.object({
    ...zoneBase,
  })
)