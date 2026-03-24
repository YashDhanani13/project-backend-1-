import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  password: z.string(),
  // .min(8, "Min 8 characters"),
  organizationName: z.string().min(1, "Organization name is required"), 
});
