import '@adonisjs/core'

declare module '@adonisjs/core/http' {
  interface Request {
    tenant?: any
  }
}
