import { z } from 'zod'

export const createSchema = z.object({
    name: z.string().min(1) ,
    email: z.string().email() ,
    age: z.coerce .string().min(17).max(100),
    phoneNumber: z.string().min(10) .max(11),
    address: z.string().min(1),
    tag: z.enum(['VIP', 'VVIP', 'regular']),
})
