import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const MarketController = () => import('#tenant/controllers/market_controller')

router
  .group(() => {
    // GET all markets
    router.get('', [MarketController, 'getAllMarkets'])

    // Featured markets
    router.get('featured', [MarketController, 'getFeaturedMarkets'])

    // Search markets
    router.get('search', [MarketController, 'searchMarkets'])

    // Get specific market
    router.get(':id', [MarketController, 'getMarketById'])

    // Get market products
    router.get(':id/products', [MarketController, 'getMarketProducts'])

    // Get market products
    router.get(':id/products/:productId', [MarketController, 'getMarketProductDetails'])

    // Get market categories
    router.get(':id/categories', [MarketController, 'getMarketCategories'])

    // Get products by category in market
    router.get(':id/categories/:categoryId/products', [
      MarketController,
      'getMarketCategoryProducts',
    ])
  })
  // .use(middleware.guest())
  .prefix('/api/v1/markets')
