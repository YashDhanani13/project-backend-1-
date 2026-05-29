import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma.js'
import { authMiddleware } from '../auth/auth.middleware.js'

const router = Router()
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const organizationId = req.organizationId!
        const userId = req.userId!

        const { contactId } = req.body

        if (!contactId) {
            return res.status(400).json({
                success: false,
                message: 'contactId is required!',
            })
        }

        const contact = await prisma.contact.findFirst({
            where: {
                id: Number(contactId),
                organizationId,
            },
        })

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found!',
            })
        }

        console.log('CONTACT:', contact)

        const otherUserId = contact.userId

        if (!otherUserId) {
            return res.status(400).json({
                success: false,
                message: 'Contact is not linked to a user',
            })
        }

        const canonicalKey = [userId, otherUserId]
            .sort((a, b) => a - b)
            .join('-')

        let room = await prisma.room.findUnique({
            where: { canonicalKey },
        })

        if (!room) {
            try {
                room = await prisma.room.create({
                    data: {
                        name: 'Private Chat',
                        type: 'DIRECT',
                        canonicalKey,
                        organizationId,
                        createdBy: userId,
                    },
                })
            } catch (error: any) {
                if (error.code === 'P2002') {
                    room = await prisma.room.findUnique({
                        where: {
                            canonicalKey,
                        },
                    })
                } else {
                    throw error
                }
            }
        }

        let conversation = await prisma.conversation.findFirst({
            where: {
                roomId: room!.id,
            },
            include: {
                contact: true,
                room: true,
            },
        })

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    organizationId,
                    contactId: Number(contactId),
                    roomId: room!.id,
                    lastMessage: '',
                    createdBy: userId,
                },
                include: {
                    contact: true,
                    room: true,
                },
            })
        }

        return res.json({
            success: true,
            data: conversation,
        })
    } catch (error: any) {
        console.error('CREATE CONVERSATION ERROR:', error)

        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}) //  get conversationn last  conversauitn this
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const organizationId = req.organizationId!

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
        const active = conversations.filter((c) => !c.room?.isDeleted)

        res.json({ success: true, data: active })
    } catch (error: any) {
        console.error('FETCH CONVERSATIONS ERROR:', error.message)
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
})

// update  conversation  : -

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
