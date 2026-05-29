import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../auth/auth.middleware.js';
const router = Router();
router.get('/:roomId', authMiddleware, async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const userId = Number(req.userId);
        if (!roomId || Number.isNaN(roomId)) {
            return res.status(400).json({
                success: false,
                message: 'Valid roomId is required',
            });
        }
        const member = await prisma.userRoom.findUnique({
            where: {
                userId_roomId: {
                    userId,
                    roomId,
                },
            },
        });
        if (!member) {
            return res.status(403).json({
                success: false,
                message: 'You are not a member of this room',
            });
        }
        const messages = await prisma.message.findMany({
            where: {
                roomId,
                isDeleted: false,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return res.json({
            success: true,
            data: messages,
        });
    }
    catch (error) {
        console.error('FETCH MESSAGES ERROR:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
        });
    }
});
export default router;
