import { Server, Socket } from 'socket.io'

export const roomSocket = (io: Server, socket: Socket) => {
    // join room first time
    socket.on('join_room', (roomId) => {
        socket.join(String(roomId))

        console.log(` Joined Room: ${roomId}`)
    })
    // ---------------------------------------------------------------
    //leave room : -

    socket.on('leave_room', (roomId) => {
        socket.leave(String(roomId))

        console.log(`Left Room: ${roomId}`)
    })
}
