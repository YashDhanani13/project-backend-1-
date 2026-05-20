import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma.js'
import { authMiddleware } from '../auth/auth.middleware.js'

const router = Router()

// create a conversation  :-----------------------------------------------------------------
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
            where: { id: contactId, organizationId },
        })

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found!',
            })
        }

        // Exiting   conversoin   ------------------------------------------------------------------------------
        const existingConversation = await prisma.conversation.findFirst({
            where: { organizationId, contactId },
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
        })

        if (existingConversation) {
            return res.json({ success: true, data: existingConversation })
        }

        // ✅ Create room + conversation in transaction
        const result = await prisma.$transaction(async (tx) => {
            // ✅ Create room
            const room = await tx.room.create({
                data: {
                    name: 'Private Chat',
                    type: 'DIRECT',
                    organization: { connect: { id: organizationId } },
                    createdByUser: { connect: { id: userId } },
                    // ✅ Add user to room
                    userRooms: {
                        create: {
                            userId,
                            organizationId,
                            createdBy: userId,
                        },
                    },
                },
            })

            // Create conversation
            const conversation = await tx.conversation.create({
                data: {
                    organizationId,
                    contactId,
                    roomId: room.id,
                    lastMessage: '',
                    createdBy: userId,
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
            })

            return conversation
        })

        res.status(201).json({ success: true, data: result })
    } catch (error: any) {
        console.error('CREATE CONVERSATION ERROR:', error.message)
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
})

//  get conversationn last  conversauitn this   
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

        // ✅ filter deleted rooms
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
