import prisma from "../../lib/prisma.js";
import { EmployeeRole, EmployeeStatus } from "@prisma/client";

export const createEmployee = async (data: any) => {
  return await prisma.employee.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role as EmployeeRole,
      phoneNumber: data.phoneNumber,
      status: data.status as EmployeeStatus,
    },
  });
};

export const getEmployee = async (search?: string) => {
  return await prisma.employee.findMany({
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

export const updateEmployee = async (id: number, data: any) => {
  return await prisma.employee.update({
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

export const deleteEmployee = async (id: number) => {
  return await prisma.employee.delete({
    where: { id },
  });
};
