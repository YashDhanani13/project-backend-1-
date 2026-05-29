import prisma from '../lib/prisma.js';
import { updateConversationLastMessage } from './conversation.route.js';
export const messageSocket = (_io, socket) => {
    socket.on('send_message', async ({ roomId, text }) => {
        try {
            const parsedRoomId = Number(roomId);
            const messageText = String(text || '').trim();
            const userId = Number(socket.data.userId);
            if (!parsedRoomId || Number.isNaN(parsedRoomId) || !messageText) {
                socket.emit('message_error', {
                    message: 'Valid roomId and text are required',
                });
                return;
            }
            const member = await prisma.userRoom.findUnique({
                where: {
                    userId_roomId: {
                        userId,
                        roomId: parsedRoomId,
                    },
                },
            });
            if (!member) {
                socket.emit('message_error', {
                    message: 'You are not a member of this room',
                });
                return;
            }
            const message = await prisma.message.create({
                data: {
                    text: messageText,
                    roomId: parsedRoomId,
                    senderId: userId,
                },
            });
            await updateConversationLastMessage(parsedRoomId, messageText);
            socket.to(String(parsedRoomId)).emit('receive_message', message);
            socket.emit('receive_message', message);
        }
        catch (error) {
            console.error('SEND MESSAGE ERROR:', error);
            socket.emit('message_error', {
                message: 'Failed to send message',
            });
        }
    });
};
