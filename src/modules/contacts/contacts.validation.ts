import { z } from 'zod'

export const createSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    age: z
        .string()
        .trim()
        .min(1, 'Age is required')
        .regex(/^\d+$/, 'Age must be a valid number')
        .transform((val) => Number(val))
        .refine((val) => val >= 17, {
            message: 'Age must be at least 17',
        })
        .refine((val) => val <= 100, {
            message: 'Age must be at most 100',
        }),
    tag: z.enum(['VIP', 'VVIP', 'regular']),
    phoneNumber: z.string().min(10).max(11),
    address: z.string().min(1),
})
