import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DeliveryController = () => import('#deliveries/controllers/delivery_controller')

router
  .group(() => {
    router.post('/assign', [DeliveryController, 'assignDelivery'])
    //.use(middleware.permission(['create:deliveries', 'update:deliveries']))

    // Delivery management
    router.get('/my', [DeliveryController, 'getMyDeliveries'])
    router.patch('/:id/status', [DeliveryController, 'updateStatus'])

    // .use(middleware.permission(['read:deliveries', 'update:deliveries']))

    router.get('', [DeliveryController, 'index']) //.use(middleware.permission(['read:deliveries']))
    router.get('/:id', [DeliveryController, 'show']) //.use(middleware.permission(['read:deliveries']))
  })
  .prefix('/api/v1/deliveries')
  .use(middleware.auth())
  .use(middleware.checkTenant())
