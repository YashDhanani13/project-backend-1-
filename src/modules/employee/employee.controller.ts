// import * as employeeService from "./employee.service";
import { type Request, type Response } from "express";
import * as employeeService from "./employee.service";

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const result = await employeeService.createEmployee(req.body);

    res.status(201).json({
      success: true,
      message: "Employee created succesfuilly ",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create to employee",
    });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const result = await employeeService.getEmployee();

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
    const { search } = req.query;

    const result = await employeeService.getEmployee(search as string);

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
    const { id } = req.params;
    const result = await employeeService.updateEmployee(Number(id), req.body);

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
    const { id } = req.params;
    const result = await employeeService.deleteEmployee(Number(id));
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
