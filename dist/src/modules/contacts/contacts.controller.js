"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContact = exports.getContacts = exports.createContact = void 0;
const ContactService = __importStar(require("./contacts.service.js"));
const createContact = async (req, res) => {
    try {
        const result = await ContactService.createContact(req.body);
        res.status(201).json({
            success: true,
            message: "Contact created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create contact",
        });
    }
};
exports.createContact = createContact;
const getContacts = async (req, res) => {
    try {
        const { search, field, value } = req.query;
        const result = await ContactService.getContacts(search, field, value);
        res.status(200).json({
            success: true,
            message: "Contacts retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get contacts",
        });
    }
};
exports.getContacts = getContacts;
const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ContactService.updateContact(Number(id), req.body);
        res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update contact",
        });
    }
};
exports.updateContact = updateContact;
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ContactService.deleteContact(Number(id));
        res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to delete contact",
        });
    }
};
exports.deleteContact = deleteContact;
