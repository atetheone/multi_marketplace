import Ws from '#services/socket_service'
import { CreateNotificationDto } from '#notification/types/notification'
import Notification from '#notification/models/notification'
import { Exception } from '@adonisjs/core/exceptions'

export class NotificationService {
  /**
   * Create and emit a new notification
   */
  async createNotification(dto: CreateNotificationDto) {
    try {
      const notification = await Notification.create({
        type: dto.type,
        title: dto.title,
        message: dto.message,
        userId: dto.userId,
        tenantId: dto.tenantId,
        data: dto.data ? JSON.parse(JSON.stringify(dto.data)) : undefined,
        isRead: false,
      })

      // Debug socket rooms and connections
      console.log('Active socket rooms:', await this.listRooms())
      console.log('Connected clients:', await this.getConnectedClients())

      // Emit to specific user's room
      Ws.io.to(`user:${dto.userId}`).emit('notification', notification)

      // Emit to tenant admins room for specific notification types
      if (this.isAdminNotification(dto.type)) {
        console.log('Emitting to tenant admin room:', `tenant:${dto.tenantId}:admin`)
        Ws.io.to(`tenant:${dto.tenantId}:admin`).emit('notification', {
          ...notification.toJSON(),
          importance: 'high',
        })
      }

      return notification
    } catch (error) {
      throw new Exception('Failed to persist notification', {
        code: 'NOTIFICATION_PERSISTENCE_ERROR',
        status: 500,
        cause: error,
      })
    }
  }

  async markAsRead(notificationId: number, userId: number) {
    const notification = await Notification.query()
      .where('id', notificationId)
      .where('user_id', userId)
      .firstOrFail()

    notification.isRead = true
    await notification.save()

    return notification
  }

  async markAllAsRead(userId: number) {
    const updated = await Notification.query()
      .where('user_id', userId)
      .where('is_read', false)
      .update({ isRead: true })

    return { affected: updated }
  }

  async getUnreadCount(userId: number) {
    const result = await Notification.query()
      .where('user_id', userId)
      .where('is_read', false)
      .count('id', 'count')
      .first()

    return { count: Number(result?.$extras.count || 0) }
  }

  async getNotifications(userId: number, tenantId: number) {
    const notifications = await Notification.query()
      .where('user_id', userId)
      .where('tenant_id', tenantId)
      .orderBy('created_at', 'desc')

    return notifications
  }

  async getNotification(id: number, notificationId: any, tenantId: number) {
    return await Notification.query()
      .where('id', notificationId)
      .where('user_id', id)
      .where('tenant_id', tenantId)
      .firstOrFail()
  }

  /**
   * Check if notification type requires admin notification
   */
  private isAdminNotification(type: string): boolean {
    const adminTypes = [
      'order:created',
      'order:cancelled',
      'inventory:low',
      'inventory:reorder',
      'payment:failed',
      'user:registered',
    ]
    return adminTypes.includes(type)
  }

  /**
   * Debug helper: List all active socket rooms
   */
  private async listRooms() {
    const rooms = new Set<string>()
    const sockets = await Ws.io.fetchSockets()

    for (const socket of sockets) {
      socket.rooms.forEach((room) => rooms.add(room))
    }

    return Array.from(rooms)
  }

  /**
   * Debug helper: Get connected clients info
   */
  private async getConnectedClients() {
    const sockets = await Ws.io.fetchSockets()
    return sockets.map((socket) => ({
      id: socket.id,
      rooms: Array.from(socket.rooms),
      user: socket.data.user
        ? {
            id: socket.data.user.id,
            roles: socket.data.user.roles?.map((r: any) => r.name),
          }
        : null,
    }))
  }
}
