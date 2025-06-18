import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { MarketService } from '#tenant/services/market_service'
import { ApiResponse } from '#utils/api_response'

@inject()
export default class MarketController {
  constructor(protected marketService: MarketService) {}

  async getAllMarkets({ response }: HttpContext) {
    const allMakets = await this.marketService.getAllMarkets()

    return ApiResponse.success(response, 'Markets retrieved successfully', allMakets)
  }

  async getFeaturedMarkets({ response }: HttpContext) {
    const markets = await this.marketService.getFeaturedMarkets()
    return ApiResponse.success(response, 'Featured markets retrieved successfully', markets)
  }

  async searchMarkets({ request, response }: HttpContext) {
    const { query } = request.qs()
    const markets = await this.marketService.searchMarkets(query)

    return ApiResponse.success(response, 'Markets search results', markets)
  }

  async getMarketById({ params, response }: HttpContext) {
    const market = await this.marketService.getMarketById(params.id)

    return ApiResponse.success(response, 'Market retrieved successfully', market)
  }

  async getMarketProducts({ params, request, response }: HttpContext) {
    const { page = 1, limit = 10, categoryId } = request.qs()
    const products = await this.marketService.getMarketProducts(params.id, {
      page,
      limit,
      categoryId,
    })

    return ApiResponse.success(response, 'Market products retrieved successfully', products)
  }

  async getMarketProductDetails({ params, request, response }: HttpContext) {
    const tenantId = params.id
    const productId = params.productId
    const productDetails = await this.marketService.getMarketProductDetails(tenantId, productId)

    return ApiResponse.success(response, 'Product retrieved successfully', productDetails)
  }

  async getMarketCategories({ params, response }: HttpContext) {
    const categories = await this.marketService.getMarketCategories(params.id)

    return ApiResponse.success(response, 'Market categories retrieved successfully', categories)
  }

  async getMarketCategoryProducts({ params, request, response }: HttpContext) {
    const { page = 1, limit = 10 } = request.qs()
    const products = await this.marketService.getCategoryProducts(params.id, params.categoryId, {
      page,
      limit,
    })

    return ApiResponse.success(response, 'Category products retrieved successfully', products)
  }
}
