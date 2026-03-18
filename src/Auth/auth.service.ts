import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


interface AuthPayload {
  email: string;
  password: string;
}

 const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

export const signupUser = async (payload: AuthPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      email: payload.email,
      password: hashedPassword,
    },
  });

  return { id: user.id, email: user.email };
};

export const loginUser = async (payload: AuthPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET!, {
    expiresIn: "24h",
  });

  return { token, user: { id: user.id, email: user.email } };
};
