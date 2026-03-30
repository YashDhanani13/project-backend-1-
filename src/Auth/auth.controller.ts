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
  }


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

      const result = await AuthService.updateUserProfile(
        user.userId,
        body
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































  // import nodemailer from "nodemailer";

  // const otpStore = new Map<string, string>();

  // function generateOtp() {
  //   return Math.floor(1000 + Math.random() * 9000).toString();
  // }

  // // const transporter = nodemailer.createTransport({
  // //   host: "smtp.gmail.com",
  // //   port: 587,
  //   secure: false,
  //   auth: {
  //     user: "yashdhanani16@gmail.com",
  //     pass: "uuvkroialaqafyqi",
  //   },
  // });
  // export const signup = async (req: Request, res: Response) => {
  //   console.log("Signup Request:", req.body.email);
  //   try {
  //     const result = await AuthService.signupUser(req.body);

  //     // Automatically send OTP after successful signup
      // const otp = generateOtp();
      // otpStore.set(req.body.email, otp);

      // try {
      //   await transporter.sendMail({
      //     from: '"Yash" <yashdhanani16@gmail.com>',
      //     to: req.body.email,
      //     subject: "Welcome! Your OTP Verification Code",
      //     text: `Thank you for signing up! Your OTP is ${otp}`,
      //   });
    //     console.log(`OTP sent automatically to ${req.body.email}`);
    //   } catch (emailError) {
    //     console.error("Failed to send OTP after signup:", emailError);
    //   }

    //   res.status(201).json({
    //     success: true,
    //     message: "User created successfully. OTP sent to email.",
    //     data: result,
    //   });
    // } catch (error: any) {
    //   res.status(400).json({
    //     success: false,
  //       message: error.message || "Signup failed",
  //     });
  //   }
  // };

  // // send otp
  // export const sendOtp = async (req: Request, res: Response) => {
  //   const { email } = req.body;

  //   const otp = generateOtp();

  //   otpStore.set(email, otp);

//   try {
//     await transporter.sendMail({
//       from: '"Yash" <yashdhanani16@gmail.com>',
//       to: email,
//       subject: "OTP Verification",
//       text: `Your OTP is ${otp}`,
//     });

//     res.json({ message: "OTP sent" });
//   } catch (err) {
//     res.status(500).json({ message: "Email failed" });
//   }
// };

// // verify otp
// export const verifyOtp = (req: Request, res: Response) => {
//   const { email, otp } = req.body;

//   const saved = otpStore.get(email);

//   if (saved === otp) {
//     otpStore.delete(email);

//     res.json({
//       message: "OTP verified",
//     });
//     return;
//   }

//   res.status(400).json({
//     message: "Invalid OTP",
//   });
// };

