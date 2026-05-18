import { Server, Socket } from 'socket.io'

export const roomSocket = (io: Server, socket: Socket) => {
    socket.on('join_room', (roomId) => {
        socket.join(String(roomId))

        console.log(` Joined Room: ${roomId}`)
    })

    socket.on('leave_room', (roomId) => {
        socket.leave(String(roomId))

        console.log(`Left Room: ${roomId}`)
    })
}
