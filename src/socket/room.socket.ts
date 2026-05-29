import { Server, Socket } from 'socket.io'
import prisma from '../lib/prisma.js'

export const roomSocket = (_io: Server, socket: Socket) => {
    // JOIN ROOM
    socket.on('join_room', async (roomId) => {
        try {
            // convert room id
            const parsedRoomId = Number(roomId)

            // logged in user
            const userId = Number(socket.data.userId)

            // check room id
            if (!parsedRoomId) {
                socket.emit('room_error', {
                    message: 'Room id required',
                })

                return
            }

            // check user in room
            const member = await prisma.userRoom.findUnique({
                where: {
                    userId_roomId: {
                        userId: userId,
                        roomId: parsedRoomId,
                    },
                },
            })

            // user not member
            if (!member) {
                socket.emit('room_error', {
                    message: 'You are not room member',
                })

                return
            }

            // join socket room
            socket.join(String(parsedRoomId))

            console.log('JOIN ROOM:', parsedRoomId)
        } catch (error) {
            console.log('JOIN ROOM ERROR:', error)

            socket.emit('room_error', {
                message: 'Join room failed',
            })
        }
    })
}
