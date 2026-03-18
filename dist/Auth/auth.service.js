"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.signupUser = void 0;
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
const signupUser = async (payload) => {
    const existingUser = await prisma_js_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (existingUser) {
        throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 10);
    const user = await prisma_js_1.default.user.create({
        data: {
            email: payload.email,
            password: hashedPassword,
        },
    });
    return { id: user.id, email: user.email };
};
exports.signupUser = signupUser;
const loginUser = async (payload) => {
    const user = await prisma_js_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const isMatch = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isMatch)
        throw new Error("Invalid password");
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "24h",
    });
    return { token, user: { id: user.id, email: user.email } };
};
exports.loginUser = loginUser;
