import { inject } from '@adonisjs/core'
import User from '#user/models/user'
import { NotificationService } from './notification_service.js'

@inject()
export class NotificationRolesService {
  constructor(protected notificationService: NotificationService) {}

  /**
   * Map notification types to roles that should receive them
   */
  private getNotificationRoles(type: string): string[] {
    const roleMap: Record<string, string[]> = {
      'order:created': ['admin', 'manager', 'sales'],
      'order:status_updated': ['admin', 'manager', 'sales'],
      'order:cancelled': ['admin', 'manager', 'sales'],
      'inventory:low': ['admin', 'manager', 'inventory'],
      'inventory:reorder': ['admin', 'manager', 'inventory'],
      'payment:received': ['admin', 'finance'],
      'payment:failed': ['admin', 'finance'],
      'user:registered': ['admin'],
      'report:generated': ['admin', 'manager'],
    }

    return roleMap[type] || ['admin']
  }

  /**
   * Send notification to users with specific roles in a tenant
   */
  async notifyRoles(params: {
    type: string
    title: string
    message: string
    tenantId: number
    data?: Record<string, any>
    roles?: string[] // Now optional
  }) {
    const targetRoles = params.roles || this.getNotificationRoles(params.type)

    const users = await User.query()
      .whereHas('roles', (query) => {
        query.whereIn('name', targetRoles)
      })
      .whereHas('tenants', (query) => {
        query.where('tenant_id', params.tenantId)
      })

    for (const user of users) {
      await this.notificationService.createNotification({
        type: params.type,
        title: params.title,
        message: params.message,
        userId: user.id,
        tenantId: params.tenantId,
        data: params.data,
      })
    }
  }
}
