import { MessageType } from '@prisma/client';
import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../auth/auth.middleware.js';
const router = Router();
const getAuthUser = (req) => ({
    userId: Number(req.userId),
    organizationId: Number(req.organizationId),
});
const findReceiverUserId = async (contact, currentUserId) => {
    if (contact.userId && contact.userId !== currentUserId) {
        return contact.userId;
    }
    const user = await prisma.user.findUnique({
        where: { email: contact.email },
        select: { id: true },
    });
    if (!user || user.id === currentUserId) {
        return null;
    }
    return user.id;
};
const ensureRoomMember = async (userId, roomId, organizationId, createdBy) => {
    await prisma.userRoom.upsert({
        where: {
            userId_roomId: {
                userId,
                roomId,
            },
        },
        update: {},
        create: {
            userId,
            roomId,
            organizationId,
            createdBy,
        },
    });
};
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { userId, organizationId } = getAuthUser(req);
        const contactId = Number(req.body.contactId);
        if (!contactId || Number.isNaN(contactId)) {
            return res.status(400).json({
                success: false,
                message: 'Valid contactId is required',
            });
        }
        const contact = await prisma.contact.findFirst({
            where: {
                id: contactId,
                organizationId,
            },
            select: {
                id: true,
                email: true,
                userId: true,
            },
        });
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }
        const otherUserId = await findReceiverUserId(contact, userId);
        if (!otherUserId) {
            return res.status(400).json({
                success: false,
                message: 'Contact is not linked to another registered user',
            });
        }
        const canonicalKey = [userId, otherUserId]
            .sort((a, b) => a - b)
            .join('-');
        let room = await prisma.room.findUnique({
            where: { canonicalKey },
        });
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
                });
            }
            catch (error) {
                if (error.code !== 'P2002')
                    throw error;
                room = await prisma.room.findUnique({
                    where: { canonicalKey },
                });
            }
        }
        if (!room) {
            return res.status(500).json({
                success: false,
                message: 'Room creation failed',
            });
        }
        await Promise.all([
            ensureRoomMember(userId, room.id, organizationId, userId),
            ensureRoomMember(otherUserId, room.id, organizationId, userId),
        ]);
        let conversation = await prisma.conversation.findUnique({
            where: { roomId: room.id },
            include: {
                contact: true,
                room: true,
            },
        });
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    organizationId,
                    contactId,
                    roomId: room.id,
                    lastMessage: '',
                    createdBy: userId,
                },
                include: {
                    contact: true,
                    room: true,
                },
            });
        }
        return res.status(200).json({
            success: true,
            data: conversation,
        });
    }
    catch (error) {
        console.error('CREATE CONVERSATION ERROR:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        });
    }
});
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { userId, organizationId } = getAuthUser(req);
        const conversations = await prisma.conversation.findMany({
            where: {
                organizationId,
                room: {
                    isDeleted: false,
                    userRooms: {
                        some: { userId },
                    },
                },
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
            orderBy: { lastMessageAt: 'desc' },
        });
        return res.status(200).json({
            success: true,
            data: conversations,
        });
    }
    catch (error) {
        console.error('FETCH CONVERSATIONS ERROR:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        });
    }
});
export const updateConversationLastMessage = async (roomId, text, type = MessageType.TEXT) => {
    await prisma.conversation.updateMany({
        where: { roomId },
        data: {
            lastMessage: text,
            lastMessageAt: new Date(),
            lastMessageType: type,
        },
    });
};
export default router;
