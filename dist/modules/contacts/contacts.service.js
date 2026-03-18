"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContact = exports.getContacts = exports.createContact = void 0;
const prisma_js_1 = __importDefault(require("../../lib/prisma.js"));
const client_1 = require("@prisma/client");
const createContact = async (data) => {
    return await prisma_js_1.default.contact.create({
        data: {
            name: data.name,
            email: data.email,
            age: data.age,
            phoneNumber: data.phoneNumber,
            address: data.address,
            tag: data.tag,
        },
    });
};
exports.createContact = createContact;
const getContacts = async (search, field, value) => {
    const where = {};
    if (search && !field && !value) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
            { phoneNumber: { contains: search, mode: "insensitive" } },
            ...(Object.values(client_1.Tag).includes(search?.toUpperCase())
                ? [{ tag: { equals: search?.toUpperCase() } }]
                : []),
        ];
    }
    if (field && value && !search) {
        if (field === "tag") {
            where[field] = { equals: value };
        }
        else {
            where[field] = {
                contains: value,
                mode: "insensitive",
            };
        }
    }
    return prisma_js_1.default.contact.findMany({ where });
};
exports.getContacts = getContacts;
const updateContact = async (id, data) => {
    return prisma_js_1.default.contact.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            age: data.age,
            phoneNumber: data.phoneNumber,
            address: data.address,
            tag: data.tag,
        },
    });
};
exports.updateContact = updateContact;
const deleteContact = async (id) => {
    return prisma_js_1.default.contact.delete({
        where: { id },
    });
};
exports.deleteContact = deleteContact;
