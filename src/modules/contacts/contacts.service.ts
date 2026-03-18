import prisma from "../../lib/prisma.js";
import { Tag } from "@prisma/client";

export const createContact = async (data: any) => {
  return await prisma.contact.create({
    data: {
      name: data.name,
      email: data.email,
      age: data.age,
      phoneNumber: data.phoneNumber,
      address: data.address,
      tag: data.tag as Tag,
    },
  });
};

export const getContacts = async (
  search?: string,
  field?: string,
  value?: string,
) => {
  const where: any = {};

  if (search && !field && !value) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
      { phoneNumber: { contains: search, mode: "insensitive" } },
      ...(Object.values(Tag).includes(search?.toUpperCase() as Tag)
        ? [{ tag: { equals: search?.toUpperCase() as Tag } }]
        : []),
    ];
  }

  if (field && value && !search) {
    if (field === "tag") {
      where[field] = { equals: value as Tag };
    } else {
      where[field] = {
        contains: value,
        mode: "insensitive",
      };
    }
  }
  return prisma.contact.findMany({ where });
};

export const updateContact = async (id: number, data: any) => {
  return prisma.contact.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      age: data.age,
      phoneNumber: data.phoneNumber,
      address: data.address,
      tag: data.tag as Tag,
    },
  });
};

export const deleteContact = async (id: number) => {
  return prisma.contact.delete({
    where: { id },
  });
};
