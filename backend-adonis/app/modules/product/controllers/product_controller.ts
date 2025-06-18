import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { ProductService } from '#product/services/product_service'
import { createProductValidator, updateProductValidator, uploadImageValidator } from '#product/validators/product'
import { ApiResponse } from '#utils/api_response'
import type { CreateProductDto, UpdateProductDto } from '#product/types/product'

@inject()
export default class ProductController {
  constructor(protected productService: ProductService) {}

  async index({ request, response }: HttpContext) {
    const tenant = request.tenant
    const products = await this.productService.listProducts(tenant.id)
    return ApiResponse.success(response, 'Products retrieved successfully', products)
  }

  async store({ request, response }: HttpContext) {
    const tenant = request.tenant
    const data: CreateProductDto = await request.validateUsing(createProductValidator)
    const product = await this.productService.createProduct({ ...data, tenantId: tenant.id })
    return ApiResponse.created(response, 'Product created successfully', product)
  }

  async show({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    const product = await this.productService.getProduct(params.id, tenant.id)
    return ApiResponse.success(response, 'Product retrieved successfully', product)
  }

  async update({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    const data: UpdateProductDto = await request.validateUsing(updateProductValidator)
    const product = await this.productService.updateProduct({
      ...data,
      id: params.id,
      tenantId: tenant.id,
    })
    return ApiResponse.success(response, 'Product updated successfully', product)
  }

  async uploadImages({ request, response, params }: HttpContext) {
    const tenant = request.tenant
    const files = request.allFiles()

    console.log('Image: ' + JSON.stringify(files, null, 3))

    if (!files.images || !Array.isArray(files.images)) {
      return ApiResponse.error(response, 'No images provided', 400)
    }

    const product = await this.productService.uploadProductImages(
      params.id,
      files.images,
      tenant.id
    )

    return ApiResponse.success(response, 'Images uploaded successfully', product)
  }

  async deleteImage({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    await this.productService.deleteProductImage(params.imageId, tenant.id)
    return ApiResponse.success(response, 'Image deleted successfully')
  }

  async destroy({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    await this.productService.deleteProduct(params.id, tenant.id)
    return ApiResponse.success(response, 'Product deleted successfully')
  }
}
