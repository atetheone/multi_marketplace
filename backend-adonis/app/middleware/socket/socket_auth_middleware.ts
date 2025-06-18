import type { Authenticators } from '@adonisjs/auth/types'
import type { SocketMiddleware } from '#services/socket_service'
import { Exception } from '@adonisjs/core/exceptions'
import { CustomSocket } from '#services/socket_types'

const SocketAuthMiddleware = (
  options: { guards?: (keyof Authenticators)[] } = {}
): SocketMiddleware => {
  return async (socket: CustomSocket, next: (err?: Error) => void) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        throw new Exception('Authentication token is required')
      }
      // Remove Bearer prefix if present
      const cleanToken = token.replace('Bearer ', '');

      // Set token in context for auth middleware
      socket.context.request.request.headers.authorization = `Bearer ${cleanToken}`;

      // Attempt authentication
      await socket.context.auth.authenticateUsing(options.guards)
      // Get authenticated user
      const user = socket.context.auth.getUserOrFail()

      console.log(JSON.stringify(user, null, 3))
      // Store user data in socket
      socket.data.user = user

      // Join user-specific room
      socket.join(`user:${user.id}`)

      // Load user roles if needed
      await user.load('roles')

      // Join role-specific rooms
      user.roles.forEach((role) => {
        socket.join(`role:${role.name}`)
      })



      console.log('Socket authenticated:', {
        socketId: socket.id,
        userId: user.id,
        rooms: Array.from(socket.rooms),
      })

      next()
    } catch (error) {
      console.error('Socket authentication failed:', {
        socketId: socket.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      if (error instanceof Exception) {
        next(error)
      } else {
        next(new Error('Authentication failed'))
      }
    }
  }
}

export default SocketAuthMiddleware
