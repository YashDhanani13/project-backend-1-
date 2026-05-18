import prisma from '../../lib/prisma.js';
//create
export const createEmployee = async (data) => {
    const orgId = Number(data.organizationId);
    const creatorId = Number(data.createdBy);
    if (isNaN(orgId) || isNaN(creatorId)) {
        throw new Error(`Missing or invalid IDs: organizationId=${data.organizationId}, userID=${data.createdBy}`);
    }
    return await prisma.employee.create({
        data: {
            name: data.name,
            email: data.email,
            role: data.role,
            phoneNumber: data.phoneNumber,
            status: data.status,
            organizationId: orgId,
            createdBy: creatorId,
        },
    });
};
export const getEmployee = async (search, field, value, organizationId) => {
    const where = {};
    if (organizationId)
        where.organizationId = organizationId;
    // SCENARIO 1: Global Search (Look in everything)
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            //    { role: { contains: search, mode: "insensitive" } },
            { phoneNumber: { contains: search, mode: "insensitive" } },
            //   { status: { contains: search, mode: "insensitive" } },
        ];
    }
    else if (field && value) {
        // ✅ Check if field is EITHER "role" OR "status"
        if (field === "role" || field === "status") {
            ;
            where[field] = {
                equals: value.toUpperCase(),
            };
        }
        else {
            ;
            where[field] = {
                contains: value,
                mode: "insensitive",
            };
        }
    }
    return prisma.employee.findMany({ where });
};
export const updateEmployee = async (id, organizationId, data) => {
    const employee = await prisma.employee.findFirst({
        where: { id, organizationId },
    });
    if (!employee)
        throw new Error('Employee not found or access denied');
    return await prisma.employee.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            role: data.role,
            phoneNumber: data.phoneNumber,
            status: data.status,
            updatedBy: data.updatedBy ? Number(data.updatedBy) : undefined,
        },
    });
};
export const deleteEmployee = async (id, organizationId) => {
    const employee = await prisma.employee.findFirst({
        where: { id, organizationId },
    });
    if (!employee)
        throw new Error('Employee not found or access denied');
    return await prisma.employee.delete({
        where: { id },
    });
};
