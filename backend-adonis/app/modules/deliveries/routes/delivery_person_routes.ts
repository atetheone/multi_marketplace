import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DeliveryPersonController = () => import('#deliveries/controllers/delivery_person_controller')

router
  .group(() => {
    router.post('', [DeliveryPersonController, 'store'])
    router.get('', [DeliveryPersonController, 'index'])
    router.put('/:id', [DeliveryPersonController, 'update'])
    router.get('/:id', [DeliveryPersonController, 'show'])
    router.put('/:id/zones', [DeliveryPersonController, 'updateZones'])

    router.get('/profile', [DeliveryPersonController, 'getMyProfile'])
    router.put('/profile/availability', [DeliveryPersonController, 'toggleAvailability'])
    router.put('/profile/zones', [DeliveryPersonController, 'updateZones'])
  })
  .prefix('/api/v1/delivery-persons')
  .use(middleware.auth())
  .use(middleware.checkTenant())
