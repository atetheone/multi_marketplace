import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#user/models/user'
import Role from '#auth/models/role'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class RoleMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(ctx: HttpContext, next: NextFn, requiredRoles: string[]) {
    // Vérifier l'authentification
    await ctx.auth.use('jwt').authenticate()
    const user = ctx.auth.use('jwt').user as User

    // Load roles
    await user.load('roles')

    // Vérifier les permissions
    const hasRoles: boolean = requiredRoles.some((reqRole) =>
      user.roles.some((role) => role.name === reqRole)
    )

    if (!hasRoles)
      return ctx.response.forbidden({
        status: 'error',
        message: 'Forbidden access',
        roles: requiredRoles,
      })

    return next()
  }
}
