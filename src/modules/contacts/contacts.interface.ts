import { Tag } from '@prisma/client'

interface ContactInput {
    name: string
    email: string
    age?: number
    phoneNumber?: string
    address?: string
    tag?: Tag
}
