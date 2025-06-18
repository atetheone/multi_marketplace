export enum NotificationType {
  ORDER_STATUS = 'order_status',
  INVENTORY_ALERT = 'inventory_alert',
  NEW_ORDER = 'new_order',
  PAYMENT_STATUS = 'payment_status',
  DELIVERY_UPDATE = 'delivery_update',
  ACCOUNT_UPDATE = 'account_update',
  SYSTEM_ALERT = 'system_alert',
}

export interface BaseNotification {
  type: string
  title: string
  message: string
  data?: Record<string, any>
}

export interface NotificationDto extends BaseNotification {
  id: number
  isRead: boolean
  userId: number
  tenantId: number
  createdAt: string
  updatedAt: string
}

export interface CreateNotificationDto extends BaseNotification {
  userId: number
  tenantId: number
}

export interface UpdateNotificationDto {
  isRead: boolean
}

export interface GetNotificationsQueryDto {
  page?: number
  limit?: number
  type?: string
  isRead?: boolean
}
