import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma.js'

export const authMiddleware = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                message: 'No token',
            })
        }

        const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
        const userId = decoded.userId || decoded.id
        let organizationId = decoded.organizationId

        // get org if missing
        if (!organizationId && userId) {
            const user = await prisma.user.findUnique({
                where: { id: Number(userId) },
            })

            if (user) {
                organizationId = user.organizationId
            }
        }

        if (!userId || !organizationId) {
            return res.status(401).json({
                message: 'Invalid token data',
            })
        }

        req.user = {
            userId,
            organizationId,
        }

        req.userId = userId
        req.organizationId = organizationId
        next()
    } catch (error: any) {
        return res.status(401).json({
            message: 'Invalid token',
            error: error.message,
        })
    }
}
