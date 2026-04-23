import { Prisma, Tag } from '@prisma/client'
import prisma from '../../lib/prisma.js'
import { CreateContactData, UpdateContactData, ContactResponse } from './contacts.interface.js'

export const createContact = async (
  data: CreateContactData
): Promise<ContactResponse> => {
  const orgId = Number(data.organizationId)
  const creatorId = Number(data.createdBy)

  if (isNaN(orgId) || isNaN(creatorId)) {
    throw new Error(
      `Missing or invalid IDs: organizationId=${data.organizationId}, createdBy=${data.createdBy}`
    )
  }

  return await prisma.contact.create({
    data: {
      name: data.name,
      email: data.email,
      age: data.age ? Number(data.age) : undefined,
      tag: data.tag as Tag,
      phoneNumber: data.phoneNumber,
      address: data.address,
      organizationId: orgId,
      createdBy: creatorId,
    },
  })
}

export const getContacts = async (
  search?: string,
  field?: string,
  value?: string,
  organizationId?: number
) => {
  // ✅ Prisma.ContactWhereInput instead of any
  const where: Prisma.ContactWhereInput = {}

  if (organizationId) where.organizationId = organizationId

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
      { phoneNumber: { contains: search, mode: 'insensitive' } },
    ]
  } else if (field && value) {
    if (field === 'tag') {
      where.tag = { equals: value.toUpperCase() as Tag }
    } else {
      // ✅ type safe field access
      (where as Record<string, unknown>)[field] = {
        contains: value,
        mode: 'insensitive'
      }
    }
  }

  return prisma.contact.findMany({ where })
}
// contacts.service.ts
export const searchContacts = async (
  search: string,
  organizationId: number
) => {

  const where: Prisma.ContactWhereInput = {
    organizationId  // ✅ only this org
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phoneNumber: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
    ]
  }

  return prisma.contact.findMany({ where })
}


export const updateContact = async (
  id: number,
  organizationId: number,
  data: UpdateContactData
) => {
  const contact = await prisma.contact.findFirst({
    where: { id, organizationId },
  })
  if (!contact) throw new Error('Contact not found or access denied')

  return prisma.contact.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      age: data.age,
      phoneNumber: data.phoneNumber,
      address: data.address,
      tag: data.tag as Tag,
      updatedBy: data.updatedBy ? Number(data.updatedBy) : undefined,
    },
  })
}

export const deleteContact = async (
  id: number,
  organizationId: number
) => {
  const contact = await prisma.contact.findFirst({
    where: { id, organizationId },
  })
  if (!contact) throw new Error('Contact not found or access denied')

  return prisma.contact.delete({
    where: { id },
  })
}