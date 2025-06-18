import vine from '@vinejs/vine'
import { MultipartFile } from '@adonisjs/core/bodyparser'

interface ImageUploadData {
  file: MultipartFile
  altText?: string
  isCover: boolean
  displayOrder: number
}

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    description: vine.string().trim(),
    price: vine.number().positive().optional(),
    sku: vine.string().trim().minLength(3).maxLength(50),
    stock: vine.number().min(0),
    isActive: vine.boolean().optional(),
    categoryIds: vine.array(vine.number()).optional(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    description: vine.string().trim().optional(),
    price: vine.number().positive().optional(),
    sku: vine.string().trim().minLength(3).maxLength(50).optional(),
    stock: vine.number().min(0).optional(),
    isActive: vine.boolean().optional(),
  })
)

export const uploadImageValidator = vine.compile(
  vine.object({
    documents: vine.array(
      vine.file({
        size: '2mb',
        extnames: ['jpg', 'png', 'webp'],
      })
    ),
  })
)

export const addProductImagesValidator = vine.compile(
  vine.object({
    images: vine
      .array(
        vine.object({
          file: vine.file({
            size: '5mb',
            extnames: ['jpg', 'jpeg', 'png', 'webp'],
          }),
          altText: vine.string().trim().maxLength(255).optional(),
          isCover: vine.boolean().optional(),
          displayOrder: vine.number().min(0).optional(),
        })
      )
      .minLength(1)
      .maxLength(10),
  })
)

export const updateProductImageValidator = vine.compile(
  vine.object({
    altText: vine.string().trim().maxLength(255).optional(),
    isCover: vine.boolean().optional(),
    displayOrder: vine.number().min(0).optional(),
  })
)

export const updateStockValidator = vine.compile(
  vine.object({
    stock: vine.number().min(0),
  })
)
