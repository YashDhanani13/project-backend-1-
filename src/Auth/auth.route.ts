import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authMiddleware } from "./auth.middleware.js";

import { signUp, login } from "./auth.controller.js";

import { signupSchema } from "./auth.validation.js";
import { z } from "zod";

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

// router.post("/send-otp", sendOtp);
// router.post("/verify-otp", verifyOtp);

router.post("/signup", validate(signupSchema), signUp);
router.post("/login", login);

// router.get("/userprofile, authMiddleware, createProfile");
// router.put("/updateUserProfile  , authMiddleware , profileUpdate");
