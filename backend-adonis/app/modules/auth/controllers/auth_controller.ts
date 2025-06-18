import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { loginValidator } from '#auth/validators/login'
import AuthService from '#auth/services/auth_service'
import { LoginCredentialsDto } from '#auth/types/login_credentials'
import { ApiResponse } from '#utils/api_response'
import User from '#user/models/user'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}
  /*
  Given a user sending a request with { email, password }, this method should:
  - Validate the request body
  - Check the user credentials
  - Generate a JWT token
  - Return the token to the user
  */
  public async login({ auth, request, response }: HttpContext) {
    const loginCredentials: LoginCredentialsDto = await request.validateUsing(loginValidator)
    const tenant = request.tenant
    // use authService...
    const loginResponse = await this.authService.login(auth, loginCredentials, tenant.id)
    // console.log(JSON.stringify(loginResponse, null, 3))
    return ApiResponse.success<any>(response, 'User logged in sucessfully', loginResponse)
  }

  public async logout({ request, response, auth }: HttpContext) {
    const message = await this.authService.logout(auth)

    return ApiResponse.success(response, 'message')
  }

  public async refreshToken({ request, response, auth }: HttpContext) {
    const token = await this.authService.refreshToken(auth)

    return ApiResponse.success(response, '', token)
  }

  public async me({ auth, response }: HttpContext) {
    try {
      const currentUser = await this.authService.checkAuthStatus(auth)
      return ApiResponse.success<User>(response, 'User authenticated', currentUser as User)
    } catch (error) {
      return response.unauthorized({
        success: false,
        message: 'User not authenticated',
      })
    }
  }
}
