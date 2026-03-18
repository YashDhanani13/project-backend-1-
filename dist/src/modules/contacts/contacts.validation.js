"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
const zod_1 = require("zod");
exports.createSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    age: zod_1.z.number().int().positive(),
    phoneNumber: zod_1.z.string().min(10),
    address: zod_1.z.string().min(1),
    tag: zod_1.z.enum(["VIP", "VVIP", "regular"]),
});
