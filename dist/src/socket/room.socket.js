import prisma from '../lib/prisma.js';
export const roomSocket = (_io, socket) => {
    socket.on('join_room', async (roomId) => {
        try {
            const parsedRoomId = Number(roomId);
            const userId = Number(socket.data.userId);
            if (!parsedRoomId || Number.isNaN(parsedRoomId)) {
                socket.emit('room_error', {
                    message: 'Valid roomId is required',
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
                socket.emit('room_error', {
                    message: 'You are not a member of this room',
                });
                return;
            }
            socket.join(String(parsedRoomId));
            console.log(`Joined room: ${parsedRoomId}`);
        }
        catch (error) {
            console.error('JOIN ROOM ERROR:', error);
            socket.emit('room_error', {
                message: 'Failed to join room',
            });
        }
    });
    socket.on('leave_room', (roomId) => {
        socket.leave(String(roomId));
    });
};
