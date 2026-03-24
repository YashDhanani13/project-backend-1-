import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token." });
        return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    const userId = decoded.id || decoded.userId;
    let organizationId = decoded.organizationId;
    
    if (!organizationId && userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        organizationId = user.organizationId;
      }
    }

    if (!userId || !organizationId) {
        res.status(401).json({ message: "Token missing required session info." });
        return;
    }

    req.userId = userId;
    req.organizationId = organizationId;
    next();
  } catch (error: any) {
    res.status(401).json({ message: "Invalid token.", error: error.message });
  }
};