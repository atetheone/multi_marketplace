import { inject } from '@adonisjs/core'
import Category from '#product/models/category'

@inject()
export class CategoryService {

  async listCategories(tenantId: number) {
    const categories = await Category.query()
      .where('tenant_id', tenantId)
      .preload('children')
      .whereNull('parent_id') // Get only parent categories
      .orderBy('created_at', 'desc')

    return categories
  }

  async getCategoryById(id: number, tenantId: number) {
    const category = await Category.query()
      .where('id', id)
      .where('tenant_id', tenantId)
      .preload('children')
      // .preload('products', (query) => {
      //   query.preload('images', (imgQuery) => {
      //     imgQuery.orderBy('display_order', 'asc')
      //   })
      // })
      .first()

    if (!category) {
      throw new Exception('Category not found', {
        status: 404,
        code: 'CATEGORY_NOT_FOUND'
      })
    }

    return category
  }

  async createCategory(data: CreateCategoryDto & { tenantId: number }) {
    const existingCategory = await Category.query()
      .where('name', data.name)
      .where('tenant_id', data.tenantId)
      .first()

    if (existingCategory) {
      throw new Exception('Category with this name already exists', {
        status: 409,
        code: 'CATEGORY_NAME_CONFLICT',
      })
    }

    return await Category.create({
      ...data,
      isActive: data.isActive ?? true,
    })
  }

  async updateCategory(data: UpdateCategoryDto & { tenantId: number }) {
    const category = await Category.query()
      .where('id', data.id)
      .where('tenant_id', data.tenantId)
      .first()

    if (!category) {
      throw new Exception('Category not found', {
        status: 404,
        code: 'CATEGORY_NOT_FOUND'
      })
    }

    await category.merge(data).save()
    return category
  }

  async deleteCategory(id: number, tenantId: number) {
    const category = await Category.query().where('id', id).where('tenant_id', tenantId).first()

    if (!category) {
      throw new Exception('Category not found', {
        status: 404,
        code: 'CATEGORY_NOT_FOUND',
      })
    }

    await category.delete()
  }
}
