import * as AuthService from "./auth.service.js";
import { type Request, type Response } from "express";
 


export const signup = async (req: Request, res: Response) => {
  console.log("Signup Request:", req.body.email);
  try {
    const result = await AuthService.signupUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
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
    const result = await AuthService.loginUser(req.body);
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

