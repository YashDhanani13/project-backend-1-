import { type Request, type Response } from "express";
import * as ContactService from "./contacts.service.js";

export const createContact = async (req: Request, res: Response) => {
  try {
    const userReq = req as any;
    const body = {
      ...req.body,
      organizationId: userReq.organizationId,
      createdBy: userReq.userId,
    };  
    
      
    console.log("Controller prepared body:", body);

    const result = await ContactService.createContact(body);
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
    const userReq = req as any;
    const { search, field, value } = req.query;

    const result = await ContactService.getContacts(
      search as string,
      field as string,
      value as string,
      userReq.organizationId,
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
    const userReq = req as any;
    const { id } = req.params;
    const body = {
      ...req.body,
      updatedBy: userReq.userId,
    };
    const result = await ContactService.updateContact(Number(id), userReq.organizationId, body);
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
    const userReq = req as any;
    const { id } = req.params;
    const result = await ContactService.deleteContact(
      Number(id),
      userReq.organizationId,
    );
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
