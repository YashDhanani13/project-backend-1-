import prisma from '../lib/prisma.js';
export const messageSocket = (io, socket) => {
    // --------------------------------
    // SEND MESSAGE
    // --------------------------------
    socket.on('send_message', async ({ roomId, text }) => {
        try {
            console.log('ROOM ID:', roomId);
            console.log('TEXT:', text);
            // ✅ Save to DB
            const message = await prisma.message.create({
                data: {
                    text,
                    roomId: Number(roomId),
                    senderId: 1,
                },
            });
            // ✅ Fixed — String(roomId)
            io.to(String(roomId)).emit('receive_message', message);
        }
        catch (error) {
            console.error('DATABASE ERROR:', error);
        }
    });
    // --------------------------------
    // DELETE MESSAGE
    // --------------------------------
    socket.on('delete_message', async ({ messageId, roomId }) => {
        try {
            // ✅ Soft delete in DB
            await prisma.message.update({
                where: { id: messageId },
                data: { isDeleted: true },
            });
            // ✅ Fixed — String(roomId)
            io.to(String(roomId)).emit('message_deleted', { messageId });
        }
        catch (error) {
            console.error('DELETE ERROR:', error);
        }
    });
    // --------------------------------
    // DISCONNECT
    // --------------------------------
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
};
