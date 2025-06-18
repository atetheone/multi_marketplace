import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { ResourceService } from '#role/services/resource_service'
import { ApiResponse } from '#utils/api_response'
import {
  createResourceValidator,
  updateResourceValidator,
} from '#role/validators/resource_validator'

@inject()
export default class ResourceController {
  constructor(protected resourceService: ResourceService) {}

  async index({ request, response }: HttpContext) {
    const resources = await this.resourceService.listResources(request.tenant?.id)
    return ApiResponse.success(response, 'Resources retrieved successfully', resources)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createResourceValidator)
    const resource = await this.resourceService.createResource({
      ...data,
      tenantId: request.tenant?.id,
    })
    return ApiResponse.created(response, 'Resource created successfully', resource)
  }

  async show({ params, request, response }: HttpContext) {
    const resource = await this.resourceService.getResourceWithPermissions(
      params.id,
      request.tenant?.id
    )
    return ApiResponse.success(response, 'Resource retrieved successfully', resource)
  }

  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateResourceValidator)
    const resource = await this.resourceService.updateResource(params.id, data, request.tenant?.id)
    return ApiResponse.success(response, 'Resource updated successfully', resource)
  }

  async destroy({ params, request, response }: HttpContext) {
    await this.resourceService.deleteResource(params.id, request.tenant?.id)
    return ApiResponse.success(response, 'Resource deleted successfully')
  }

  async syncPermissions({ params, request, response }: HttpContext) {
    const resource = await this.resourceService.syncResourcePermissions(
      params.id,
      request.tenant?.id
    )
    return ApiResponse.success(response, 'Resource permissions synced successfully', resource)
  }
}
