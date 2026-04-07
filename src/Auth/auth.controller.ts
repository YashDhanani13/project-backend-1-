import * as authService from "./auth.service.js";

// import   updateUserProfile from  "./auth.service.js";

import { type Request, type Response } from "express";

import { loginSchema, signupSchema } from "./auth.validation.js";

export const signUp = async (req: Request, res: Response) => {
  try {
    const validated = signupSchema.parse(req.body);
    const result = await authService.signupUser(validated);

    res.status(200).json({
      success: true,
      message: "Signup successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Signup failed",
    });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await authService.loginUser(validated);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const data = await authService.getUserProfile(userId);

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
     const userReq = req as any;

    const body = {
      ...req.body,
      updatedBy: user.userId,
    };

    const result = await authService.updateUserProfile 
    (user.userId, 
         userReq.organizationId,
      body,
    );

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
