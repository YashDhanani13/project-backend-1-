import { EmployeeRole, EmployeeStatus, Tag } from '@prisma/client'

export interface CreateEmployeeData {
    name: string
    email: string
    role: EmployeeRole
    phoneNumber: string
    status: EmployeeStatus
    organizationId: number | string
    createdBy: number | string
}

export interface UpdateEmployeeData {
    name?: string
    email?: string
    role?: EmployeeRole
    status?: EmployeeStatus
    phoneNumber?: string
    updatedBy: number | string
}

export interface EmployeeResponse {
    id: number
    name: string
    email: string
    role?: EmployeeRole
    status?: EmployeeStatus
    phoneNumber?: string | null
    organizationId: number
    createdBy: number
    updatedBy: number | null
    createdAt: Date
    updatedAt: Date
}
