import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UserController = () => import('#user/controllers/user_controller')

router
  .group(() => {
    router.post('', [UserController, 'create']).use(middleware.permission(['create:users']))
    router.get('', [UserController, 'index']).use(middleware.permission(['read:users']))
    router
      .get('/roles', [UserController, 'getUsersWithRole'])
      .use(middleware.permission(['read:users']))
    router.get(':id', [UserController, 'show']).use(middleware.permission(['read:users']))
    router.put('/profile', [UserController, 'updateProfile'])
    router.put(':id', [UserController, 'update']).use(middleware.permission(['update:users']))

    router.delete(':id', [UserController, 'delete']).use(middleware.permission(['delete:users']))
  })
  .use(middleware.checkTenant())
  .use(middleware.auth({ guards: ['jwt'] }))
  .prefix('/api/v1/users')
