import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PermissionController = () => import('#role/controllers/permission_controller')

router
  .group(() => {
    // Permission routes
    router
      .post('/', [PermissionController, 'create'])
      .use(middleware.permission(['create:permissions']))

    router
      .get('/', [PermissionController, 'index'])
      .use(middleware.permission(['read:permissions']))

    router
      .get('/:id', [PermissionController, 'show'])
      .use(middleware.permission(['read:permissions']))

    router
      .put('/:id', [PermissionController, 'update'])
      .use(middleware.permission(['update:permissions']))

    router
      .delete('/:id', [PermissionController, 'destroy'])
      .use(middleware.permission(['delete:permissions']))
  })
  .use(middleware.checkTenant())
  .use(middleware.auth({ guards: ['jwt'] }))
  .prefix('/api/v1/permissions')
