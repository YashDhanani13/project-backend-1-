import { z } from 'zod';
export const createEmployeeSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'EMPLOYEE']),
    phoneNumber: z.string().min(10).max(11),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});
