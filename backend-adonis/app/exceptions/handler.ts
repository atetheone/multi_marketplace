import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import { ApiResponse } from '#utils/api_response'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof Exception) {
      return ApiResponse.error(ctx.response, error.message, error.status || 500, [
        { message: error.message },
      ])
    }

    // Handle validation errors
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ApiResponse.error(
        ctx.response,
        'Validation failed',
        422,
        error.messages?.errors?.map((e: any) => ({ message: e.message })) || []
      )
    }

    // Handle authentication errors
    if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return ApiResponse.error(ctx.response, 'Unauthorized access', 401, [
        { message: 'Please login to continue' },
      ])
    }

    // Handle credential verification errors
    if (error.code === 'E_INVALID_CREDENTIALS') {
      return ApiResponse.error(ctx.response, 'Invalid credentials', 401, [
        { message: 'Invalid email or password' },
      ])
    }
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
