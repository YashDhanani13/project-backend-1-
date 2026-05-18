import { z } from 'zod';
// create a  recevive  schema    : -
export const createSchema = z.object({
    message: z.string().min(1),
    number: z.string(),
    emoji: z.string()
});
