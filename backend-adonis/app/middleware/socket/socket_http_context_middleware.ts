import { ServerResponse } from 'node:http'
import app from '@adonisjs/core/services/app'
import type { SocketMiddleware } from '#services/socket_service'
import { CustomSocket } from '#services/socket_types'

const SocketHttpContextMiddleware: SocketMiddleware = async (socket: CustomSocket, next) => {
  try {
    const adonisServer = await app.container.make('server')

    // Create a dummy response object
    const response = new ServerResponse(socket.request)

    // Create HTTP context
    const context = adonisServer.createHttpContext(
      adonisServer.createRequest(socket.request, response),
      adonisServer.createResponse(socket.request, response),
      app.container.createResolver()
    )

    // Initialize auth
    const auth = await app.container.make('auth.manager')
    context.auth = auth.createAuthenticator(context)

    // Store context in socket
    socket.context = context

    // Clean up context on disconnect
    // socket.on('disconnect', () => {
    //   if (socket.context) {
    //     // Perform any necessary cleanup
    //     socket.context.auth = null
    //     socket.context = null
    //   }
    // })

    console.log('HTTP context created for socket:', socket.id)
    next()
  } catch (error) {
    console.error('Failed to create HTTP context for socket:', {
      socketId: socket.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    next(new Error('Failed to create HTTP context'))
  }
}

export default SocketHttpContextMiddleware
