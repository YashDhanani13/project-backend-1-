import { Tag } from '@prisma/client'

export interface CreateContactData {
  name: string
  email: string
  age?: number | string // Allow string if coming from form-data
  phoneNumber?: string
  address?: string
  tag?: Tag
  organizationId: number | string 
  createdBy: number | string      // Removed '?' because your function requires it to exist
}

export interface UpdateContactData {
  name?: string
  email?: string
  age?: number
  phoneNumber?: string
  address?: string
  tag?: Tag
  updatedBy: number | string     // Usually required to track who made the change
}

export interface ContactResponse {
  id: number
  name: string
  email: string
  age?: number | null           // Prisma returns null for empty optional fields
  phoneNumber?: string | null
  address?: string | null
  tag?: Tag | null
  organizationId: number
  createdBy: number
  updatedBy?: number | null
  createdAt: Date               // Recommended to include timestamps
  updatedAt: Date
}