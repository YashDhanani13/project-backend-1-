import { Server, Socket } from 'socket.io'
import prisma from '../lib/prisma.js'

//recevive
export const messageSocket = (io: Server, socket: Socket) => {
    //recevice the message    from the   fronted this  : -

    socket.on('send_message', async ({ roomId, text }) => {
        try {
            const message = await prisma.message.create({
                data: {
                    text,
                    roomId: Number(roomId),
                    senderId: socket.data.userId,
                },
            })

            // send back   user-2

            io.to(String(roomId)).emit('receive_message', message)


            
        } catch (error) {
            console.error('DATABASE ERROR:', error)
        }
    })

    // disconnect this  thne this  :-  }

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
}
