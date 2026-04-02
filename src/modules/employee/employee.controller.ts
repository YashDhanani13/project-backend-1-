import { type Request, type Response } from "express";
import * as employeeService from "./employee.service.js";
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const userReq = req as any;

    const body = {
      ...req.body,
      organizationId: userReq.organizationId,
      userID: userReq.userId, // Change
    };

    console.log("Controller prepared body:", body);

    const result = await employeeService.createEmployee(body);

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create employee",
    });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const userReq = req as any;
    const result = await employeeService.getEmployee(
      undefined,
      userReq.organizationId,
    );

    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get employees",
    });
  }
};

export const getSearch = async (req: Request, res: Response) => {
  try {
    const userReq = req as any;
    const { search } = req.query;

    const result = await employeeService.getEmployee(
      search as string,
      userReq.organizationId,
    );

    res.status(200).json({
      success: true,
      message: "Search success",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Search not found",
    });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const userReq = req as any;
    const { id } = req.params;
    const body = {
      ...req.body,
      updatedBy: userReq.userId,
    };
    const result = await employeeService.updateEmployee(
      Number(id),
      userReq.organizationId,
      body,
    );

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update Employee",
    });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const userReq = req as any;
    const { id } = req.params;
    const result = await employeeService.deleteEmployee(
      Number(id),
      userReq.organizationId,
    );
    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete Employee",
    });
  }
};
