import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const MenuItemController = () => import('#navigation/controllers/menu_item_controller')

router
  .group(() => {
    router.post('', [MenuItemController, 'create']) //.use(middleware.permission(['create:menus']))

    router.get('', [MenuItemController, 'index']) //.use(middleware.permission(['read:menus']))

    router.get('structure', [MenuItemController, 'getUserMenu'])
    // .use(middleware.permission(['read:menus']))

    router.get(':id', [MenuItemController, 'show']).use(middleware.permission(['read:menus']))

    router.put(':id', [MenuItemController, 'update']).use(middleware.permission(['update:menus']))

    router.delete(':id', [MenuItemController, 'destroy'])
    //.use(middleware.permission(['delete:menus']))
  })
  .use(middleware.checkTenant())
  .use(middleware.auth({ guards: ['jwt'] }))
  .prefix('/api/v1/menus')
