import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { CategoryService } from '#product/services/category_service'
import { createCategoryValidator, updateCategoryValidator } from '#product/validators/category'
import { ApiResponse } from '#utils/api_response'
import type { CreateCategoryDto, UpdateCategoryDto } from '#product/types/category'

@inject()
export default class CategoryController {
  constructor(protected categoryService: CategoryService) {}

  async index({ request, response }: HttpContext) {
    const tenant = request.tenant
    const categories = await this.categoryService.listCategories(tenant.id)
    return ApiResponse.success(response, 'Categories retrieved successfully', categories)
  }

  async store({ request, response }: HttpContext) {
    const tenant = request.tenant
    const data: CreateCategoryDto = await request.validateUsing(createCategoryValidator)
    const category = await this.categoryService.createCategory({ ...data, tenantId: tenant.id })
    return ApiResponse.created(response, 'Category created successfully', category)
  }

  async show({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    const category = await this.categoryService.getCategoryById(params.id, tenant.id)
    return ApiResponse.success(response, 'Category retrieved successfully', category)
  }

  async update({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    const data: UpdateCategoryDto = await request.validateUsing(updateCategoryValidator)
    const category = await this.categoryService.updateCategory({
      ...data,
      id: params.id,
      tenantId: tenant.id,
    })
    return ApiResponse.success(response, 'Category updated successfully', category)
  }

  async destroy({ params, request, response }: HttpContext) {
    const tenant = request.tenant
    await this.categoryService.deleteCategory(params.id, tenant.id)
    return ApiResponse.success(response, 'Category deleted successfully')
  }
}
