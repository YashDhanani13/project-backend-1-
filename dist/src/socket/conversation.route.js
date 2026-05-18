import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../auth/auth.middleware.js';
const router = Router();
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { organizationId } = req.user;
        console.log('organizationId:', organizationId);
        const conversations = await prisma.conversation.findMany({
            where: {
                organizationId,
            },
            include: {
                contact: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNumber: true,
                        tag: true,
                    },
                },
                room: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        isDeleted: true,
                    },
                },
            },
            orderBy: {
                lastMessageAt: 'desc',
            },
        });
        const active = conversations.filter((c) => !c.room?.isDeleted);
        res.json({ success: true, data: active });
    }
    catch (error) {
        console.error('FETCH CONVERSATIONS ERROR:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
    }
});
export default router;
