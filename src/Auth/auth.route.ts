import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { getUserProfile, updateUserProfile } from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";
import { signUp, login } from "./auth.controller.js";


export const router = Router();


router.post("/signup", signUp);
router.post("/login", login);

router.get("/getUserProfile", authMiddleware, getUserProfile);

router.put("/updateUserProfile", authMiddleware, updateUserProfile);
