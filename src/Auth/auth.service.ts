import { PrismaClient, Tag } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface SignupPayload {
  fullName: string;
  email: string;
  organizationName: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}
   
//jwt  creation here  : - 

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

  
export const signupUser = async (payload: SignupPayload) => {

  
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) throw new Error("Email already exists");

  //password hashing  
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // create   organization
  const organization = await prisma.organization.create({
    data: {
      organizationName: payload.organizationName,
    },
  });

  //create  a  user  : -

  const user = await prisma.user.create({
    data: {
      fullName: payload.fullName,
      email: payload.email,
      organizationId: organization.id,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
    {
      id: user.id,
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
    },
    JWT_SECRET,
    { expiresIn: "5d" },
  );

  return {
    token,
    user: {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      organizationId: organization.id,
      organizationName: organization.organizationName,
    },
  };
};

export const loginUser = async (payload: LoginPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: { organization: true },
  });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const token = jwt.sign(
    {
      id: user.id,
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
    },
    JWT_SECRET,
    { expiresIn: "5d" },
  );

  return {
    token,
    user: {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      organizationId: user.organizationId,
      organizationName: user.organization.organizationName,
    },
  };
};

// user Profile: -

// export const getUserProfile = async (userId: string) => {

//   const user = await prisma.user.findUnique({
//     where:  { id: userId },
//     select: {

//        name: true,
//       email: true,
//       password : true,
//     }
//   })

//   return user
// }
