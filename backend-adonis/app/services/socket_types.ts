import type { HttpContext } from '@adonisjs/core/http'
import { Socket } from 'socket.io'
import User from '#user/models/user'

export interface CustomSocket extends Socket {
  context: HttpContext
  data: {
    user?: User
  }
}
