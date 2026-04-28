import { z } from 'zod'

export const createSchema = z.object({
    name: z.string().min(1) ,
    email: z.string().email() ,
    age: z.number().int().positive() .min(17) ,
    phoneNumber: z.string().min(10) .max(11),
    address: z.string().min(1),
    tag: z.enum(['VIP', 'VVIP', 'regular']),
})
