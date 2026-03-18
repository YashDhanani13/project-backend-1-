import { type Request, type Response } from "express";
import * as ContactService from "./contacts.service.js";

export const createContact = async (req: Request, res: Response) => {
  try {
    const result = await ContactService.createContact(req.body);
    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create contact",
    });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const { search, field, value } = req.query;
    const result = await ContactService.getContacts(
      search as string,
      field as string,
      value as string,
    );
    res.status(200).json({
      success: true,
      message: "Contacts retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get contacts",
    });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ContactService.updateContact(Number(id), req.body);
    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update contact",
    });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ContactService.deleteContact(Number(id));
    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete contact",
    });
  }
};
