import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ResourceController = () => import('#role/controllers/resource_controller')

router
  .group(() => {
    router.get('', [ResourceController, 'index']) //.use(middleware.permission(['read:resources']))

    router.post('', [ResourceController, 'store']) //.use(middleware.permission(['create:resources']))

    router.get(':id', [ResourceController, 'show']) //.use(middleware.permission(['read:resources']))

    router
      .put(':id', [ResourceController, 'update'])
      .use(middleware.permission(['update:resources']))

    router
      .delete(':id', [ResourceController, 'destroy'])
      .use(middleware.permission(['delete:resources']))

    router
      .post(':id/sync', [ResourceController, 'syncPermissions'])
      .use(middleware.permission(['update:resources', 'create:permissions']))
  })
  .prefix('/api/v1/resources')
  .use(middleware.auth())
  .use(middleware.checkTenant())
