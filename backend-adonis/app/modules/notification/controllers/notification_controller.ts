import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { NotificationService } from '#notification/services/notification_service'
import { ApiResponse } from '#utils/api_response'
import {
  createNotificationValidator,
  updateNotificationValidator,
} from '#notification/validators/notification'

@inject()
export default class NotificationController {
  constructor(protected notificationService: NotificationService) {}

  async index({ request, response, auth }: HttpContext) {
    const tenantId = request.tenant.id
    const user = auth.user!
    const notifications = await this.notificationService.getNotifications(user.id, tenantId)

    return ApiResponse.success(response, 'Notifications retrieved successfully', notifications)
  }

  async show({ auth, params, request, response }: HttpContext) {
    try {
      const notification = await this.notificationService.getNotification(
        auth.user!.id,
        Number.parseInt(params.id),
        request.tenant.id
      )
      return ApiResponse.success(response, 'Notification retrieved successfully', notification)
    } catch (error) {
      return ApiResponse.error(response, 'Failed to retrieve notification', error)
    }
  }

  async store({ request, auth, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createNotificationValidator)
      const notification = await this.notificationService.createNotification({
        ...payload,
        userId: auth.user!.id,
        tenantId: request.tenant.id,
      })

      return ApiResponse.success(response, 'Notification created successfully', notification)
    } catch (error) {
      return ApiResponse.error(response, 'Failed to create notification', error)
    }
  }

  async markAsRead({ params, auth, response }: HttpContext) {
    const notificationId = params.id
    const result = await this.notificationService.markAsRead(+notificationId, auth.user!.id)

    return ApiResponse.success(response, 'Notification marked as read', result)
  }

  async markAllAsRead({ response, auth }: HttpContext) {
    try {
      const result = await this.notificationService.markAllAsRead(auth.user!.id)

      return ApiResponse.success(
        response,
        `${result.affected} notifications marked as read`,
        result
      )
    } catch (error) {
      return ApiResponse.error(response, 'Failed to mark notifications as read', error)
    }
  }

  async unreadCount({ auth, response }: HttpContext) {
    try {
      const count = await this.notificationService.getUnreadCount(auth.user!.id)
      console.log('Unread count: ' + JSON.stringify(count, null, 2))
      return ApiResponse.success(response, 'Unread count retrieved successfully', count)
    } catch (error) {
      return ApiResponse.error(response, 'Failed to get unread count', error)
    }
  }
}
