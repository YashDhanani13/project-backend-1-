"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.updateEmployee = exports.getEmployee = exports.createEmployee = void 0;
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const createEmployee = async (data) => {
    return await prisma_js_1.default.employee.create({
        data: {
            name: data.name,
            email: data.email,
            role: data.role,
            phoneNumber: data.phoneNumber,
            status: data.status,
        },
    });
};
exports.createEmployee = createEmployee;
const getEmployee = async (search) => {
    return await prisma_js_1.default.employee.findMany({
        where: search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { phoneNumber: { contains: search, mode: "insensitive" } },
                ],
            }
            : {},
    });
};
exports.getEmployee = getEmployee;
const updateEmployee = async (id, data) => {
    return await prisma_js_1.default.employee.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            role: data.role,
            phoneNumber: data.phoneNumber,
            status: data.status,
        },
    });
};
exports.updateEmployee = updateEmployee;
const deleteEmployee = async (id) => {
    return await prisma_js_1.default.employee.delete({
        where: { id },
    });
};
exports.deleteEmployee = deleteEmployee;
