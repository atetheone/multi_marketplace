import { defineConfig } from '@adonisjs/auth'
import { InferAuthEvents, Authenticators } from '@adonisjs/auth/types'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
import { jwtGuard } from '#guard/config'
import { JwtGuardUser, BaseJwtContent } from '#guard/jwt_types'

interface JwtContent extends BaseJwtContent {
  email: string
}
// interface JwtContent extends BaseJwtContent {
//   email: string
//   tenantId: number
//   roles: Array<{
//     name: string
//     permissions: Array<string>
//   }>
// }

const authConfig = defineConfig({
  // define the default authenticator to jwt
  default: 'jwt',
  guards: {
    web: sessionGuard({
      useRememberMeTokens: false,
      provider: sessionUserProvider({
        model: () => import('#user/models/user'),
      }),
    }),
    // add the jwt guard
    jwt: jwtGuard({
      tokenExpiresIn: '10h',
      useCookies: false,
      provider: sessionUserProvider({
        model: () => import('#user/models/user'),
      }),
      content: (user: JwtGuardUser<User>): JwtContent => ({
        userId: user.getId(),
        email: user.getOriginal().email,
      }),
    }),
  },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
  export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
