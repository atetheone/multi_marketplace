import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DeliveryZoneController = () => import('#address/controllers/delivery_zone_controller')

router
  .group(() => {
    router.get('', [DeliveryZoneController, 'index'])
    router.post('', [DeliveryZoneController, 'store'])
    router.get(':id', [DeliveryZoneController, 'show'])
    router.put(':id', [DeliveryZoneController, 'update'])
    router.delete(':id', [DeliveryZoneController, 'destroy'])
  })
  .prefix('/api/v1/zones')
  .use(middleware.auth())
  .use(middleware.checkTenant())

export { router as zoneRoutes }
