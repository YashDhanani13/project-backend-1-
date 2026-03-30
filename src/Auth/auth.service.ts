import { PrismaClient, Tag } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

//jwt  creation here  : -
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
export interface SignupPayload {
  fullName: string;
  email: string;
  organizationName: string;
  password: string;
}


export interface LoginPayload {
  email: string;
  password: string;
}

export const signupUser = async (payload: SignupPayload) => {
  //check exitign user
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
  //create  a  user  : -=
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

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      fullName: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}; // ✅ CORRECT



export const updateUserProfile = async (
  userId: string,
  data: any
) => {
  const profileUpdate = await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      fullName: data.fullName,
      email: data.email,
      // updatedBy: Number(userId), // ✅ User updating himself!
    },
  });

  return profileUpdate;
};