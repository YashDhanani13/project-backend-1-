import prisma from '../../lib/prisma.js'
import { EmployeeRole, EmployeeStatus } from '@prisma/client'

export const createEmployee = async (data: any) => {
    const orgId = Number(data.organizationId)
    const creatorId = Number(data.userID)

    if (isNaN(orgId) || isNaN(creatorId)) {
        throw new Error(
            `Missing or invalid IDs: organizationId=${data.organizationId}, userID=${data.userID}`
        )
    }

    return await prisma.employee.create({
        data: {
            name: data.name,
            email: data.email,
            role: data.role as EmployeeRole,
            phoneNumber: data.phoneNumber,
            status: data.status as EmployeeStatus,
            organizationId: orgId,
            createdBy: creatorId,
        },
    })
}

export const getEmployee = async (
    search?: string,
    field?: string,
    value?: string,
    organizationId?: number
) => {
    const where: any = {}

    if (organizationId) where.organizationId = organizationId

    // SCENARIO 1: Global Search (Look in everything)
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            // { role: { contains: search, mode: 'insensitive' } },
            { phoneNumber: { contains: search, mode: 'insensitive' } },
            // { status: { contains: search, mode: 'insensitive' } },
        ]
    } else if (field && value) {
        if (field === 'tag') {
            where.tag = { equals: value.toUpperCase() }
        } else {
            where[field] = { contains: value, mode: 'insensitive' }
        }
    }

    return prisma.employee.findMany({ where })
}

export const updateEmployee = async (
    id: number,
    organizationId: number,
    data: any
) => {
    const employee = await prisma.employee.findFirst({
        where: { id, organizationId },
    })
    if (!employee) throw new Error('Employee not found or access denied')

    return await prisma.employee.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            role: data.role,
            phoneNumber: data.phoneNumber,
            status: data.status,
            updatedBy: data.updatedBy,
        },
    })
}

export const deleteEmployee = async (id: number, organizationId: number) => {
    const employee = await prisma.employee.findFirst({
        where: { id, organizationId },
    })
    if (!employee) throw new Error('Employee not found or access denied')

    return await prisma.employee.delete({
        where: { id },
    })
}
