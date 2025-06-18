import Ws from '#services/socket_service'

await Ws.boot()

Ws.io.on('connection', async (socket: any) => {
  console.log('Client connected:', socket.id)
  console.log('User data:', socket.data.user)

  // const user = socket.context.auth.getUserOrFail()
  socket.emit('user:connected', { user: socket.data.user })

  socket.on('disconnect', () => {
    socket.emit('user:disconnected', { user: socket.data.user })
    socket.disconnect()
  })
})
