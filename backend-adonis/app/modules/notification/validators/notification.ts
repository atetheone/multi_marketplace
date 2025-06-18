import vine from '@vinejs/vine'

export const createNotificationValidator = vine.compile(
  vine.object({
    type: vine.string(),
    title: vine.string(),
    message: vine.string(),
    data: vine.object({}).optional(),
  })
)

export const updateNotificationValidator = vine.compile(
  vine.object({
    isRead: vine.boolean(),
  })
)
