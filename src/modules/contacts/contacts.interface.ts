import { Tag } from '@prisma/client'

export interface CreateContactData {
    name: string
    email: string
    age?: number | string
    phoneNumber?: string
    address?: string
    tag?: Tag
    organizationId: number | string
    createdBy: number | string
}

export interface UpdateContactData {
    name?: string
    email?: string
    age?: number
    phoneNumber?: string
    address?: string
    tag?: Tag
    updatedBy: number | string
}

export interface ContactResponse {
    id: number
    name: string
    email: string
    age?: number | null
    phoneNumber?: string | null
    address?: string | null
    tag?: Tag | null
    organizationId: number
    createdBy: number
    updatedBy?: number | null
    createdAt: Date
    updatedAt: Date
}
