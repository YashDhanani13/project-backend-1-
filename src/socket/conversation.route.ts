// conversation.route.ts
import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { authMiddleware } from '../auth/auth.middleware.js'

const router = Router()

// GET all conversations with contact info
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { organizationId } = req.user

        const conversations = await prisma.conversation.findMany({
            where: { organizationId },

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

            orderBy: { lastMessageAt: 'desc' },
        })

        // filter deleted rooms
        // const active = conversations.filter((c) => !c.room?.isDeleted)

        // res.json({ success: true, data: active })

    } catch (error) {
        console.error('FETCH CONVERSATIONS ERROR:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch conversations',
        })
    }
})

export const updateConversationLastMessage = async (
    roomId: number,
    text: string,
    type = 'TEXT'
) => {
    await prisma.conversation.updateMany({
        where: { roomId },
        data: {
            lastMessage: text,
            lastMessageAt: new Date(),
            lastMessageType: type as any,
        },
    })
}

export default router
