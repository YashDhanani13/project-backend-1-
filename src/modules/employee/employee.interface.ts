import { EmployeeRole, EmployeeStatus, Tag } from '@prisma/client'

export interface CreateEmployeeData {
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
  updatedAt  : Date
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
  tag?: Tag   
  updatedBy: number | string 
}