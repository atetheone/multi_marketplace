import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const OrderController = () => import('#order/controllers/order_controller')

router
  .group(() => {
    // Customer routes
    router.post('', [OrderController, 'create'])
    router
      .get('', [OrderController, 'getTenantOrders'])
      .use(middleware.role(['admin', 'super-admin', 'livreur']))

    router.get('/pending', [OrderController, 'getPendingOrders'])

    router.get('/me', [OrderController, 'getUserOrders'])
    router.get(':id', [OrderController, 'show'])
    router.post(':id/cancel', [OrderController, 'cancel'])

    // Admin/Tenant routes
    router
      .group(() => {
        router.get('tenant/orders', [OrderController, 'getTenantOrders'])
        router.patch(':id/status', [OrderController, 'updateStatus'])
      })
      .use(middleware.permission(['update:orders', 'read:orders']))
  })
  .prefix('/api/v1/orders')
  .use(middleware.auth())
  .use(middleware.checkTenant())

export { router as orderRoutes }
