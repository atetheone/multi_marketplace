import cloudinary from '#config/cloudinary'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { Exception } from '@adonisjs/core/exceptions'

export class CloudinaryService {
  async uploadImage(file: MultipartFile, folder: string = 'products') {
    try {
      const result = await cloudinary.uploader.upload(file.tmpPath!, {
        folder,
        resource_type: 'auto',
      })

      return {
        url: result.secure_url,
        filename: result.public_id,
      }
    } catch (error) {
      throw new Exception('Failed to upload image', {
        code: 'UPLOAD_FAILED',
        status: 500,
      })
    }
  }

  async deleteImage(filename: string) {
    try {
      await cloudinary.uploader.destroy(filename)
    } catch (error) {
      throw new Exception('Failed to delete image', {
        code: 'DELETE_FAILED',
        status: 500,
      })
    }
  }
}
