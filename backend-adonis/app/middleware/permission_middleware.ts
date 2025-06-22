import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#user/models/user'
import Role from '#role/models/role'
import { Exception } from '@adonisjs/core/exceptions'
import PermissionService from '#services/permission_service'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class PermissionMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(ctx: HttpContext, next: NextFn, requiredPermissions: string[]) {
    try {
      // Get the authenticated user
      await ctx.auth.check()

      const user = ctx.auth.user as User
      if (!user) {
        throw new Exception('Unauthorized access (user not recognized !)', { status: 401 })
      }

      // Load roles with permissions
      await user.load('roles', (rolesQuery) => {
        rolesQuery.preload('permissions')
      })

      // Check permissions
      const hasPermission = this.checkPermissions(user.roles, requiredPermissions)

      if (!hasPermission) {
        return ctx.response.forbidden({
          status: 'error',
          message: 'Forbidden access',
          permissions: requiredPermissions,
        })
      }

      return next()
    } catch (error) {
      return ctx.response.unauthorized({
        status: 'error',
        message: 'Unauthorized access',
      })
    }
  }

  private checkPermissions(roles: Role[], requiredPermissions: string[]): boolean {
    for (const role of roles) {
      // Charger les permissions du rôle
      const rolePermissions = role.permissions.map((p) => `${p.action}:${p.resource}`)

      // Vérifier si toutes les permissions requises sont présentes
      const allPermissionsGranted = requiredPermissions.every((reqPerm) =>
        rolePermissions.includes(reqPerm)
      )
      if (allPermissionsGranted) return true
    }

    return false
  }
}
