import { PrismaClient, Tag } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SignupPayload, LoginPayload } from "./auth.interface.js";

const prisma = new PrismaClient();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
if (!JWT_REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is not defined");
}

export const signupUser = async (payload: SignupPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) throw new Error("Email already exists");

  //password hashing
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // create organization
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
 return {
  id: user.id,
  email: user.email,
  fullName: user.fullName,
};
};
// ----------------------------------------------------------------------------]
// login  user  : -
export const loginUser = async (payload: LoginPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: { organization: true },
  });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
    },
    JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "5d" },
  );

  return {
    accessToken,
    refreshToken,
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
};

export const updateUserProfile = async (userId: string, data: any) => {
  const profileUpdate = await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      fullName: data.fullName,
      email: data.email,
    },
  });

  return profileUpdate;
};
