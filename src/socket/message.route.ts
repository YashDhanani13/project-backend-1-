import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma.js'
const router = Router()

router.get('/:roomId', async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params

        const messages = await prisma.message.findMany({
            where: {
                roomId: Number(roomId),
            },

            orderBy: {
                createdAt: 'asc',
            },
        })

        res.json({
            success: true,
            data: messages,
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            success: false,

            message: 'Failed to fetch messages',
        })
    }
})

export default router
