import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CartController = () => import('#cart/controllers/cart_controller')
const CartItemController = () => import('#cart/controllers/cart_item_controller')

router
  .group(() => {
    // Cart routes
    router.get('', [CartController, 'index'])
    router.get('current', [CartController, 'getCurrentCart'])
    router.get(':id', [CartController, 'show'])
    router.post('', [CartController, 'store'])
    router.delete(':id/clear', [CartController, 'clear'])
    router.delete(':id', [CartController, 'destroy'])

    // Cart items routes
    router.post(':cartId/items', [CartItemController, 'store'])
    router.patch('items/:itemId', [CartItemController, 'update'])
    router.delete('items/:itemId', [CartItemController, 'destroy'])
  })
  .prefix('/api/v1/cart')
  .use(middleware.auth())
  .use(middleware.checkTenant())

export { router as cartRoutes }
