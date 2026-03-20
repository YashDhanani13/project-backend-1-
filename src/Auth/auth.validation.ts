import { z } from "zod";

export const signupSchema = z.object({
    fullName : z.string(),
    email: z.string().email(),
    organizationName: z.string(),
    password: z.string().min(6), 
   });
   

