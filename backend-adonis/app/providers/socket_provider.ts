import type { ApplicationService } from '@adonisjs/core/types'
import Ws from '#services/socket_service'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    ws: typeof import('#services/socket_service').default
  }
}

export default class SocketProvider {
  constructor(protected app: ApplicationService) {}

  // register() {
  //   this.app.container.singleton('ws', () => Ws)
  // }

  async ready() {
    await import('#start/socket')
  }

  // async boot() {
  //   if (this.app.isReady) {
  //     const ws = await this.app.container.make('ws')
  //     await ws.boot()
  //   }
  // }

  // async shutdown() {
  //   const ws = await this.app.container.make('ws')
  //   await ws.cleanup()
  // }
}
