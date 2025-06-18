import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ProductController = () => import('#product/controllers/product_controller')
const InventoryController = () => import('#product/controllers/inventory_controller')

router
  .group(() => {
    router.get('', [ProductController, 'index']).use(middleware.permission(['read:products']))

    router.post('', [ProductController, 'store']).use(middleware.permission(['create:products']))

    router
      .post(':id/images', [ProductController, 'uploadImages'])
      .use(middleware.permission(['update:products']))

    router.get(':id', [ProductController, 'show']).use(middleware.permission(['read:products']))

    router.put(':id', [ProductController, 'update']).use(middleware.permission(['update:products']))

    router
      .delete('/images/:imageId', [ProductController, 'deleteImage'])
      .use(middleware.permission(['update:products']))

    router
      .delete(':id', [ProductController, 'destroy'])
      .use(middleware.permission(['delete:products']))

    // Inventory management routes
    router
      .group(() => {
        router
          .patch(':id/stock', [InventoryController, 'updateStock'])
          .use(middleware.permission(['update:products']))

        router
          .patch(':id/settings', [InventoryController, 'updateSettings'])
          .use(middleware.permission(['update:products']))

        router
          .get(':id/history', [InventoryController, 'getStockHistory'])
          .use(middleware.permission(['read:inventory']))
      })
      .prefix('inventory')
  })
  .prefix('/api/v1/products')
  .use(middleware.auth({ guards: ['jwt'] }))
  .use(middleware.checkTenant())

export { router as productRouter }
