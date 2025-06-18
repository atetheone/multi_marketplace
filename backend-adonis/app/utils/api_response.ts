import type { HttpContext } from '@adonisjs/core/http'

export interface ApiResponseType<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Array<{ message: string }>
}
export class ApiResponse {
  static created<T>(response: HttpContext['response'], message: string, data: T) {
    const apiResponse: ApiResponseType<T> = {
      success: true,
      message,
      data,
    }
    return response.status(201).send(apiResponse)
  }

  static success<T>(response: HttpContext['response'], message: string, data?: T) {
    const apiResponse: ApiResponseType<T> = {
      success: true,
      message,
      data,
    }
    return response.status(200).send(apiResponse)
  }

  static error(
    response: HttpContext['response'],
    message: string,
    statusCode = 400,
    errors: Array<{ message: string }> = []
  ) {
    const apiResponse: ApiResponseType<null> = {
      success: false,
      message,
      errors,
    }
    return response.status(statusCode).send(apiResponse)
  }
}
