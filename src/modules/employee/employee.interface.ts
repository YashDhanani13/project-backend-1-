import { EmployeeRole, EmployeeStatus } from "@prisma/client";

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: EmployeeRole;
  phoneNumber: string;
  status: EmployeeStatus;
  createdAt: Date;
  updatedAt: Date;
}
