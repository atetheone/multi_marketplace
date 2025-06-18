import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import {
  registerUserValidator,
  setPasswordValidator,
  forgotPasswordValidator,
} from '#auth/validators/registration'
import RegistrationService from '#auth/services/registration_service'
import { RegistrationUserDto } from '#auth/types/registration_user'
import { ApiResponse } from '#utils/api_response'

@inject()
export default class RegistrationController {
  constructor(protected registrationService: RegistrationService) {}

  public async registerUser({ request, response }: HttpContext) {
    const tenant = request.tenant
    const user: RegistrationUserDto = await request.validateUsing(registerUserValidator)

    console.log('userDTO: ' + JSON.stringify(user, null, 3))

    const registeredUser = await this.registrationService.registerUser(user, tenant.id)

    return ApiResponse.created(response, 'User created successfully', registeredUser)
  }

  // public async registerAdmin({ request, response }: HttpContext) {}

  public async verify({ params, response }: HttpContext) {
    const token: string = params.token!

    try {
      await this.registrationService.verifyAccount(token)

      return ApiResponse.success(response, 'Email verified successfully')
    } catch (err) {
      return ApiResponse.error(response, err.message, 400, [{ message: err.message }])
    }
  }

  public async setPassword({ request, params, response }: HttpContext) {
    const token = params.token!
    const { password } = await request.validateUsing(setPasswordValidator)

    console.log(`Password: ${JSON.stringify(password, null, 3)}`)
    try {
      await this.registrationService.setPassword(password, token)

      return ApiResponse.success(response, 'Password defined successfully')
    } catch (err) {
      return ApiResponse.error(response, err.message, 400, [{ message: err.message }])
    }
  }

  public async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)
    console.log(`Password forgotten`)
    try {
      await this.registrationService.forgotPassword(email)
      return ApiResponse.success(
        response,
        'Password reset instructions have been sent to your email'
      )
    } catch (error) {
      return ApiResponse.error(response, 'Failed to process password reset request', 400)
    }
  }
}
