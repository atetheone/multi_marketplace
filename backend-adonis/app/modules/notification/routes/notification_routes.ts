import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const NotificationController = () => import('#notification/controllers/notification_controller')

router
  .group(() => {
    router.get('/', [NotificationController, 'index'])

    router.get('/unread', [NotificationController, 'unreadCount'])

    router.get('/:id', [NotificationController, 'show'])

    router.patch('/:id/read', [NotificationController, 'markAsRead'])

    router.patch('/read-all', [NotificationController, 'markAllAsRead'])
  })
  .prefix('api/v1/notifications')
  .use(middleware.auth())
  .use(middleware.checkTenant())
