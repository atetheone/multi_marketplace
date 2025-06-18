import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TenantController = () => import('#tenant/controllers/tenant_controller')

router
  .group(() => {
    router
      .post('', [TenantController, 'create'])
      .use(middleware.role(['super-admin']))
      .use(middleware.permission(['create:tenants']))

    router.get('', [TenantController, 'index']).use(middleware.permission(['read:tenants']))

    router.get(':id', [TenantController, 'show']).use(middleware.permission(['read:tenants']))
    // router.get(':id/products', [TenantController, 'getTenantProducts']).use(middleware.permission(['read:tenants']))
    // router.get(':id/products/:productId', [TenantController, 'getProductDetails']).use(middleware.permission(['read:tenants']))

    router.put(':id', [TenantController, 'update']).use(middleware.permission(['update:tenants']))

    router
      .delete(':id', [TenantController, 'destroy'])
      .use(middleware.permission(['delete:tenants']))
  })
  .use(middleware.checkTenant())
  .use(middleware.auth({ guards: ['jwt'] }))
  .prefix('/api/v1/tenants')
