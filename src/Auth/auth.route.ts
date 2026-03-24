import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { login, signup, sendOtp, verifyOtp } from "./auth.controller.js";
import { signupSchema } from "./auth.validation.js";
import { z } from "zod";
// import { UserProfile } from "./auth.service.js";
export const router = Router();

const validate =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
      return;
    }
    req.body = result.data;
    next();
  };

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Auth routes
router.post("/signup", validate(signupSchema), signup);
router.post("/login", login);

// router.get("/userprofile" ,Userprofile );
