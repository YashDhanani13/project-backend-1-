export const roomSocket = (io, socket) => {
    socket.on('join_room', (roomId) => {
        socket.join(String(roomId));
        console.log(` Joined Room: ${roomId}`);
    });
    socket.on('leave_room', (roomId) => {
        socket.leave(String(roomId));
        console.log(`Left Room: ${roomId}`);
    });
};
