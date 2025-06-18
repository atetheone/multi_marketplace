import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const RoleController = () => import('#role/controllers/role_controller')

router
  .group(() => {
    router.post('', [RoleController, 'create']).use(middleware.permission(['create:roles']))

    router.get('', [RoleController, 'index']).use(middleware.permission(['read:roles']))

    router.get(':id', [RoleController, 'show']).use(middleware.permission(['read:roles']))

    router.put(':id', [RoleController, 'update']).use(middleware.permission(['update:roles']))

    router.delete(':id', [RoleController, 'destroy']).use(middleware.permission(['delete:roles']))

    router
      .post('assign', [RoleController, 'assignRoles'])
      .use(middleware.permission(['create:role', 'create:permission']))
  })
  .use(middleware.checkTenant())
  .use(middleware.auth({ guards: ['jwt'] }))
  .prefix('/api/v1/roles')
