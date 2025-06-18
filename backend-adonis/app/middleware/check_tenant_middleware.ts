import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Tenant from '#tenant/models/tenant'
import { ApiResponse } from '#utils/api_response'

export default class CheckTenantMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const tenantSlug = ctx.request.header('X-Tenant-Slug')

    if (!tenantSlug) {
      return ApiResponse.error(ctx.response, 'Tenant slug is missing', 400)
    }

    const tenant = await Tenant.findBy('slug', tenantSlug)

    if (!tenant) {
      return ApiResponse.error(ctx.response, 'Tenant not found', 404)
    }

    // Store the tenant in the request context
    ctx.request.tenant = tenant

    await next()
  }
}
