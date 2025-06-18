import Product from '#product/models/product'
import { CreateProductDto, UpdateProductDto } from '#product/types/product'
import { Exception } from '@adonisjs/core/exceptions'
import { inject } from '@adonisjs/core'
import { CloudinaryService } from '#services/cloudinary_service'

@inject()
export class ProductService {
  constructor(protected cloudinaryService: CloudinaryService) {}

  async createProduct(data: CreateProductDto & { tenantId: number }) {
    const existingProduct = await Product.query()
      .where('sku', data.sku)
      .where('tenant_id', data.tenantId)
      .first()

    if (existingProduct) {
      throw new Exception('Product with this SKU already exists', {
        status: 409,
        code: 'SKU_CONFLICT',
      })
    }

    const { categoryIds, stock, ...productData } = data
    const product = await Product.create({
      ...productData,
      isActive: productData.isActive ?? true,
    })

    await product.related('inventory').create({
      quantity: stock || 0,
      reorderPoint: 10, // Default values
      reorderQuantity: 20,
      lowStockThreshold: 5,
      tenantId: data.tenantId,
    })

    if (categoryIds?.length > 0) {
      await product.related('categories').attach(categoryIds)
    }

    await product.load((loader) => {
      loader.load('categories')
      loader.load('inventory')
    })

    return product
  }

  async listProducts(tenantId: number) {
    const products = await Product.query()
      .where('tenant_id', tenantId)
      .preload('categories')
      .preload('images', (query) => {
        query.orderBy('display_order', 'asc')
      })
      .preload('inventory')
      .preload('tenant')
      .orderBy('created_at', 'desc')

    return products.map((product) => ({
      ...product.serialize(),
      stock: product.inventory?.quantity || 0,
      coverImage: product.images.find((img) => img.isCover),
    }))
  }

  async getProduct(id: number, tenantId: number) {
    const product = await Product.query()
      .where('id', id)
      .where('tenant_id', tenantId)
      .preload('categories')
      .preload('images')
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

  async updateProduct(data: UpdateProductDto & { tenantId: number }) {
    const { id, tenantId, stock, ...updateData } = data
    const product = await Product.query()
      .where('id', id)
      .where('tenant_id', tenantId)
      .preload('inventory')
      .first()

    if (!product) {
      throw new Exception('Product not found', {
        status: 404,
        code: 'PRODUCT_NOT_FOUND',
      })
    }

    await product.merge(updateData).save()

    // Update inventory if stock provided
    if (typeof stock === 'number') {
      if (product.inventory) {
        await product.inventory.merge({ quantity: stock }).save()
      } else {
        await product.related('inventory').create({
          quantity: stock,
          tenantId,
          reorderPoint: 10,
          reorderQuantity: 20,
          lowStockThreshold: 5,
        })
      }
    }

    await product.load((loader) => {
      loader.load('categories')
      loader.load('inventory')
      loader.load('images')
    })

    return {
      ...product.serialize(),
      stock: product.inventory?.quantity || 0,
    }
  }

  async deleteProduct(id: number, tenantId: number) {
    const product = await Product.query().where('id', id).where('tenant_id', tenantId).first()

    if (!product) {
      throw new Exception('Product not found', {
        status: 404,
        code: 'PRODUCT_NOT_FOUND',
      })
    }

    await product.delete()
  }

  async uploadProductImages(productId: number, files: MultipartFile[], tenantId: number) {
    const product = await Product.findOrFail(productId)

    for (const [index, file] of files.entries()) {
      const { url, filename } = await this.cloudinaryService.uploadImage(file)

      await product.related('images').create({
        url,
        filename,
        altText: file.clientName,
        isCover: index === 0,
        displayOrder: index,
      })
    }

    await product.load('images')
    return product
  }

  async deleteProductImage(imageId: number, tenantId: number) {
    const image = await ProductImage.query()
      .where('id', imageId)
      .whereHas('product', (query) => {
        query.where('tenant_id', tenantId)
      })
      .firstOrFail()

    await this.cloudinaryService.deleteImage(image.filename)
    await image.delete()
  }
}
