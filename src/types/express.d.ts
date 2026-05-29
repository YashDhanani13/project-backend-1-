declare namespace Express {
    export interface Request {
        user?: {
            userId: number
            organizationId: number
        }
        userId?: number
        organizationId?: number
    }
}
