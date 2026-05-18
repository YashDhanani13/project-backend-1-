import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { messageSocket } from './message.socket.js'
import { roomSocket } from './room.socket.js'

export const initializeSockets = (io: Server) => {
    // ── Auth Middleware ── attaches userId to every socket ───────────────────
    io.use((socket, next) => {  
        try {
            // Support token from auth header or cookie
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.headers?.authorization?.split(' ')[1]

            if (!token) {
                return next(new Error('Unauthorized: No token provided'))
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_ACCESS_SECRET!
            ) as { userId?: number; id?: number }

            const userId = decoded.userId || decoded.id

            if (!userId) {
                return next(new Error('Unauthorized: Invalid token data'))
            }

            socket.data.userId = userId
            next()
        } catch {
            next(new Error('Unauthorized: Invalid token'))
        }
    })

    io.on('connection', (socket) => {
        console.log(` User connected: ${socket.data.userId} [${socket.id}]`)

        roomSocket(io, socket)
        messageSocket(io, socket)

        socket.on('disconnect', () => {
            console.log(
                ` User disconnected: ${socket.data.userId} [${socket.id}]`
            )
        })
    })
}
