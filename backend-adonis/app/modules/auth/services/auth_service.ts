import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import User from '#user/models/user'
import { LoginCredentialsDto } from '#auth/types/login_credentials'
import { Exception } from '@adonisjs/core/exceptions'
import { Token } from '#auth/types/token'
import { DateTime } from 'luxon'

@inject()
export default class AuthService {
  public async login(
    auth: HttpContext['auth'],
    credentials: LoginCredentialsDto,
    tenantId: number
  ) {
    // Verify credentials and get user with roles in one step
    const user = await User.verifyCredentials(credentials.email, credentials.password)

    // Check if the user is associated with the specified tenant
    await user.load('tenants')
    const tenant = user.tenants.find((tenantParam) => +tenantParam.id === tenantId)
    if (!tenant) {
      throw new Exception('User does not belong to the specified tenant', {
        status: 403,
        code: 'FORBIDDEN',
      })
    }

    // check if the account is verified
    if (user.status !== 'active') {
      throw new Exception('Account is not verified', {
        status: 403,
        code: 'ACCOUNT_NOT_VERIFIED',
      })
    }

    await user.load((loader) => {
      loader.load('roles', (rolesQuery) => {
        rolesQuery.preload('permissions')
      })
      loader.load('profile')
    })

    const serializedUser = user.serialize({
      fields: {
        pick: ['id', 'username', 'email', 'firstName', 'lastName', 'status', 'lastLoginAt'],
      },
      relations: {
        roles: {
          fields: ['name'],
          relations: {
            permissions: {
              fields: ['resource', 'action'],
            },
          },
        },
      },
    })
    // Generate JWT token using the auth guard
    const token = (await auth.use('jwt').generate(user)) as Token
    if (!token) {
      throw new Exception('Failed to generate token', {
        status: 500,
        code: 'TOKEN_GENERATION_FAILED',
      })
    }

    // Update last login timestamp
    await user.merge({ lastLoginAt: DateTime.local() }).save()
    // console.log('token' + JSON.stringify(token, null, 3))

    return {
      user: serializedUser,
      token: token.token,
    }
  }

  public async logout(auth: HttpContext['auth']) {
    // await auth.use('jwt').logout()
    return { message: 'Logged out successfully' }
  }

  public async refreshToken(auth: HttpContext['auth']) {
    const user = auth.user!
    const token = await auth.use('jwt').generate(user)
    return token
  }

  public async checkAuthStatus(auth: HttpContext['auth']) {
    try {
      const user = auth.user!
      await user.load('roles', (rolesQuery) => {
        rolesQuery.preload('permissions')
      })

      return user.serialize()
    } catch (err) {
      throw new Exception('Failed to get user profile')
    }
  }
}
