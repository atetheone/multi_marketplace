import Tenant from '#tenant/models/tenant'
import Product from '#product/models/product'
import Category from '#product/models/category'
import { Exception } from '@adonisjs/core/exceptions'

export class MarketService {
  async getAllMarkets() {
    return await Tenant.query()
      .where('status', 'active')
      // .where('is_featured', true)
      .orderBy('rating', 'desc')
  }

  async getFeaturedMarkets() {
    return await Tenant.query()
      .where('status', 'active')
      .where('is_featured', true)
      .orderBy('rating', 'desc')
      .limit(6)
  }

  async getMarketById(tenantId: number) {
    const market = await Tenant.query().where('id', tenantId).where('status', 'active').first()

    if (!market) {
      throw new Exception('Market not found', {
        status: 404,
        code: 'MARKET_NOT_FOUND',
      })
    }

    return market
  }

  async getMarketProducts(
    marketId: number,
    options: { page: number; limit: number; categoryId?: number }
  ) {
    const query = Product.query()
      .where('tenant_id', marketId)
      .where('is_marketplace_visible', true)
      .orderBy('marketplace_priority', 'desc')
      .preload('images')
      .preload('categories')
      .preload('inventory')

    if (options.categoryId) {
      query.whereHas('categories', (builder) => {
        builder.where('id', options.categoryId)
      })
    }

    return await query.paginate(options.page, options.limit)
  }

  async getMarketCategories(marketId: number) {
    return await Category.query()
      .where('tenant_id', marketId)
      .whereNull('parent_id')
      .preload('children')
  }

  async getCategoryProducts(
    marketId: number,
    categoryId: number,
    options: { page: number; limit: number }
  ) {
    const query = Product.query()
      .where('tenant_id', marketId)
      .where('is_marketplace_visible', true)
      .whereHas('categories', (builder) => {
        builder.where('id', categoryId)
      })
      .orderBy('marketplace_priority', 'desc')
      .preload('images')
      .preload('categories')
      .preload('inventory')

    return await query.paginate(options.page, options.limit)
  }

  async getMarketProductDetails(marketId: number, productId: number) {
    const product = await Product.query()
      .where('id', productId)
      .where('tenant_id', marketId)
      .preload('images')
      .preload('categories')
      .preload('inventory')
      .first()

    if (!product) {
      throw new Exception('Product not found', {
        status: 404,
        code: 'PRODUCT_NOT_FOUND',
      })
    }

    return product
  }
}
