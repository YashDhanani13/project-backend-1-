import { Server, Socket } from 'socket.io'
import prisma from '../lib/prisma.js'
import { updateConversationLastMessage } from './conversation.route.js'

export const messageSocket = (_io: Server, socket: Socket) => {

    // SEND MESSAGE
    socket.on('send_message', async (data) => {

        try {

            // room id
            const roomId = Number(data.roomId)

            // message text
            const text = String(data.text || '').trim()

            // logged in user
            const userId = Number(socket.data.userId)

            // validation
            if (!roomId || !text) {

                socket.emit('message_error', {
                    message: 'roomId and text required',
                })

                return
            }

            // check room member
            const member = await prisma.userRoom.findUnique({
                where: {
                    userId_roomId: {
                        userId: userId,
                        roomId: roomId,
                    },
                },
            })

            // user not member
            if (!member) {

                socket.emit('message_error', {
                    message: 'You are not room member',
                })

                return
            }

            // create message
            const message = await prisma.message.create({
                data: {
                    text: text,
                    roomId: roomId,
                    senderId: userId,
                },
            })

            // update conversation
            await updateConversationLastMessage(
                roomId,
                text
            )

            // send message to room users
            socket
                .to(String(roomId))
                .emit('receive_message', message)

            // sender receive own message
            socket.emit('receive_message', message)

            console.log('MESSAGE SEND:', message.id)

        } catch (error) {

            console.log('SEND MESSAGE ERROR:', error)

            socket.emit('message_error', {
                message: 'Send message failed',
            })
        }
    })
}













// import { Server, Socket } from 'socket.io'
// import prisma from '../lib/prisma.js'
// import { updateConversationLastMessage } from './conversation.route.js'

// export const messageSocket = (_io: Server, socket: Socket) => {
//     socket.on('send_message', async ({ roomId, text }) => {
//         try {
//             const parsedRoomId = Number(roomId)
//             const messageText = String(text || '').trim()
//             const userId = Number(socket.data.userId)

//             if (!parsedRoomId || Number.isNaN(parsedRoomId) || !messageText) {
//                 socket.emit('message_error', {
//                     message: 'Valid roomId and text are required',
//                 })
//                 return
//             }

//             const member = await prisma.userRoom.findUnique({
//                 where: {
//                     userId_roomId: {
//                         userId,
//                         roomId: parsedRoomId,
//                     },
//                 },
//             })

//             if (!member) {
//                 socket.emit('message_error', {
//                     message: 'You are not a member of this room',
//                 })
//                 return
//             }

//             const message = await prisma.message.create({
//                 data: {
//                     text: messageText,
//                     roomId: parsedRoomId,
//                     senderId: userId,
//                 },
//             })

//             await updateConversationLastMessage(parsedRoomId, messageText)

//             socket.to(String(parsedRoomId)).emit('receive_message', message)
//             socket.emit('receive_message', message)
//         } catch (error) {
//             console.error('SEND MESSAGE ERROR:', error)
//             socket.emit('message_error', {
//                 message: 'Failed to send message',
//             })
//         }
//     })
// }


