import * as AuthService from "./auth.service.js";
import { type Request, type Response } from "express";
// import { type Request, type Response } from "express";

export const signUp = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.signupUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);
   res.cookie("refreshToken", result.refreshToken, {
  httpOnly: true,
  secure: true, // use true in production (HTTPS)
  sameSite: "strict",
  maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
});
    
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;

    const data = await AuthService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch profile",
    });
  }
};

export const updateUserProfile = async (req: any, res: Response) => {
  try {
    const user = req.user;

    const body = {
      ...req.body,
      updatedBy: user.userId,
    };

    const result = await AuthService.updateUserProfile(user.userId, body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};
