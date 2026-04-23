import { EmployeeRole, EmployeeStatus, Tag } from '@prisma/client'

// 1. The Core Object (What comes out of the DB)
export interface Employee {
  id: number
  name: string
  email: string
  role: EmployeeRole
  phoneNumber: string | null
  status: EmployeeStatus
  age?: number | null
  address?: string | null
  organizationId: number
  createdBy: number
  updatedBy?: number | null
  createdAt: Date
  updatedAt: Date
}

// 2. For the UPDATE (PATCH) Request
// Everything is optional because you might only update one field
export interface UpdateEmployeeData {
  name?: string
  email?: string
  role?: EmployeeRole      // Added: to allow role changes
  status?: EmployeeStatus  // Added: to allow status changes
  age?: number | string
  phoneNumber?: string
  address?: string
  tag?: Tag                // Ensure Tag is imported from @prisma/client
  updatedBy: number | string // Mandatory: for audit logs
}

// 3. The API Response
// Usually the same as Employee, but sometimes you omit sensitive data
export interface EmployeeResponse extends Employee {}