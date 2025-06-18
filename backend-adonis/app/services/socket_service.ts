import app from '@adonisjs/core/services/app'
import { Server, ServerOptions, Socket } from 'socket.io'
import { CustomSocket } from './socket_types.js'
import SocketHttpContextMiddleware from '#middleware/socket/socket_http_context_middleware'
import SocketAuthMiddleware from '#middleware/socket/socket_auth_middleware'

class Ws {
  private booted = false
  io!: Server

  async boot() {
    try {
      if (this.booted) {
        return
      }

      this.booted = true

      const adonisServer = await app.container.make('server')

      const socketConfig = app.config.get<ServerOptions>('socket', {
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
        transports: ['websocket', 'polling'],
        credentials: true,
      })

      this.io = new Server(adonisServer.getNodeServer(), socketConfig)

      // Apply middlewares
      this.io
        .use((socket, next) => SocketHttpContextMiddleware(socket as CustomSocket, next))
        .use((socket, next) =>
          SocketAuthMiddleware({ guards: ['jwt'] })(socket as CustomSocket, next)
        )

      // Setup connection handling
      this.io.on('connection', (socket) => {
        console.log('Client connected:', socket.id)

        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id)
        })
      })

      // Setup error handling
      this.io.on('error', (error) => {
        console.error('Socket.IO server error:', error)
      })

      console.log('Socket.IO server initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Socket.IO server:', error)
      throw error
    }
  }

  public isBooted(): boolean {
    return this.booted
  }

  public async cleanup() {
    if (!this.io) return

    try {
      const sockets = await this.io.fetchSockets()
      for (const socket of sockets) {
        socket.disconnect(true)
      }

      await new Promise<void>((resolve) => {
        this.io.close(() => {
          console.log('Socket.IO server closed')
          resolve()
        })
      })

      this.booted = false
    } catch (error) {
      console.error('Error during socket cleanup:', error)
    }
  }
}
export type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void | Promise<void>
export default new Ws()
