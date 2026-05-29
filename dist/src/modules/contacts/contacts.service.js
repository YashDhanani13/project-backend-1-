import prisma from '../../lib/prisma.js';
//create
export const createContact = async (data) => {
    const orgId = Number(data.organizationId);
    const creatorId = Number(data.createdBy);
    if (isNaN(orgId) || isNaN(creatorId)) {
        throw new Error(`Missing or invalid IDs: organizationId=${data.organizationId}, createdBy=${data.createdBy}`);
    }
    return await prisma.contact.create({
        data: {
            name: data.name,
            email: data.email,
            age: data.age ? Number(data.age) : undefined,
            tag: data.tag,
            phoneNumber: data.phoneNumber,
            address: data.address,
            organizationId: orgId,
            createdBy: creatorId,
        },
    });
};
export const getContacts = async (search, field, value, organizationId) => {
    const where = {};
    if (organizationId)
        where.organizationId = organizationId;
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
            { phoneNumber: { contains: search, mode: 'insensitive' } },
        ];
    }
    else if (field && value) {
        if (field === 'tag') {
            where.tag = { equals: value.toUpperCase() };
        }
        else {
            ;
            where[field] = {
                contains: value,
                mode: 'insensitive',
            };
        }
    }
    return prisma.contact.findMany({ where });
};
// contacts.service.ts
// export const searchContacts = async (
//     search: string,
//     organizationId: number
// ) => {
//     const where: Prisma.ContactWhereInput = {
//         organizationId,
//     }
//     if (search) {
//         where.OR = [
//             { name: { contains: search, mode: 'insensitive' } },
//             { email: { contains: search, mode: 'insensitive' } },
//             { phoneNumber: { contains: search, mode: 'insensitive' } },
//             { address: { contains: search, mode: 'insensitive' } },
//         ]
//     }
//     return prisma.contact.findMany({ where })
// }
export const updateContact = async (id, organizationId, data) => {
    const contact = await prisma.contact.findFirst({
        where: { id, organizationId },
    });
    if (!contact)
        throw new Error('Contact not found or access denied');
    return prisma.contact.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            age: data.age,
            phoneNumber: data.phoneNumber,
            address: data.address,
            tag: data.tag,
            updatedBy: data.updatedBy ? Number(data.updatedBy) : undefined,
        },
    });
};
export const deleteContact = async (id, organizationId) => {
    const contact = await prisma.contact.findFirst({
        where: { id, organizationId },
    });
    // if (!contact) throw new Error('Contact not found or access denied')
    return prisma.contact.delete({
        where: { id },
    });
};
