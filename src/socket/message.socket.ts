import { Server, Socket } from 'socket.io'
import prisma from '../lib/prisma.js'

//recevive
export const messageSocket = (io: Server, socket: Socket) => {
    socket.on('send_message', async ({ roomId, text }) => {
        try {
            // if (!socket.data.userId) {
            //     socket.emit('error', { message: 'Unauthorized user' })
            //     return
            // }

            const message = await prisma.message.create({
                data: {
                    text,
                    roomId: Number(roomId),
                    senderId: socket.data.userId,
                },
            })

            io.to(String(roomId)).emit('receive_message', message)
        } catch (error) {
            console.error('DATABASE ERROR:', error)
            // socket.emit('e/rror', { message: 'Failed to send message' })
        }
    })

    // ///delee  the messageg
    // socket.on('delete_message', async ({ messageId, roomId }) => {
    //     try {
    //         if (!socket.data.userId) {
    //             socket.emit('error', { message: 'Unauthorized user' })
    //             return
    //         }

    //         await prisma.message.update({
    //             where: {
    //                 id: messageId,
    //                 senderId: socket.data.userId,
    //             },
    //             data: { isDeleted: true },
    //         })
    //         io.to(String(roomId)).emit('message_deleted', { messageId })
    //     } catch (error) {
    //         console.error('DELETE ERROR:', error)
    //         socket.emit('error', { message: 'Failed to delete message' })
    //     }
    // })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
}
