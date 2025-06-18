import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CategoryController = () => import('#product/controllers/category_controller')

router
  .group(() => {
    router
      .get('', [CategoryController, 'index'])
      .use(middleware.permission(['read:products']))

    router
      .post('', [CategoryController, 'store'])
      .use(middleware.permission(['create:products']))

    router
      .get(':id', [CategoryController, 'show'])
      .use(middleware.permission(['read:products']))

    router
      .put(':id', [CategoryController, 'update'])
      .use(middleware.permission(['update:products']))

    router
      .delete(':id', [CategoryController, 'destroy'])
      .use(middleware.permission(['delete:products']))
  })
  .prefix('/api/v1/categories')
  .use(middleware.auth({ guards: ['jwt'] }))
  .use(middleware.checkTenant())

export { router as categoryRouter }
