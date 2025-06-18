import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AddressController = () => import('#address/controllers/address_controller')

router
  .group(() => {
    router.get('', [AddressController, 'index'])
    router.post('', [AddressController, 'store'])
    router.get(':id', [AddressController, 'show'])
    router.get('default/shipping', [AddressController, 'getDefaultShipping'])
    router.put(':id', [AddressController, 'update'])
    router.delete(':id', [AddressController, 'destroy'])
  })
  .prefix('/api/v1/addresses')
  .use(middleware.auth())
  .use(middleware.checkTenant())

export { router as addressRoutes }
