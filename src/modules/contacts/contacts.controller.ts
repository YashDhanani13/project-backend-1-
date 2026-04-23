import { type Request, type Response } from 'express'
import * as ContactService from './contacts.service.js'
import logger from '../../utils/logger.js'
import { CreateContactData, UpdateContactData } from './contacts.interface.js'

// ✅ no any!
export const createContact = async (req: Request, res: Response) => {
  logger.info('Creating a new contact')
  try {
    const body: CreateContactData = {
      ...req.body,
      organizationId: req.organizationId,  // ✅ typed
      createdBy: req.userId,               // ✅ typed
    }

    const result = await ContactService.createContact(body)
    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: result,
    })
  } catch (error: any) {
    logger.error(`Error creating contact: ${error.message}`)
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create contact',
    })
  }
}

// ✅ no any!
export const getContacts = async (req: Request, res: Response) => {
  logger.info('Retrieving contacts')
  try {
    const { search, field, value } = req.query

    const result = await ContactService.getContacts(
      search as string,
      field as string,
      value as string,
      req.organizationId  // ✅ typed
    )
    res.status(200).json({
      success: true,
      message: 'Contacts retrieved successfully',
      data: result,
    })
  } catch (error:any) {
    logger.error(`Error retrieving contacts: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get contacts',
    })
  }
}

// contacts.controller.ts
export const searchContacts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query  // ✅ get search

    const result = await ContactService.searchContacts(
      search as string,
      req.organizationId!
    )

    res.status(200).json({
      success: true,
      message: "Contacts found",
      data: result
    })

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message || "Search failed"
      })
    }
  }
}

// ✅ no any!
export const updateContact = async (req: Request, res: Response) => {
  logger.info('Updating contact')
  try {
    const id = Number(req.params.id)

    const body: UpdateContactData = {
      ...req.body,
      updatedBy: req.userId,  // ✅ typed
      age: req.body.age ? Number(req.body.age) : undefined,
    }

    const result = await ContactService.updateContact(
      id,
      req.organizationId!,  // ✅ typed
      body
    )
    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: result,
    })
  } catch (error: any) {
    logger.error(`Error updating contact: ${error.message}`)
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update contact',
    })
  }
}

// ✅ no any!
export const deleteContact = async (req: Request, res: Response) => {
  logger.info('Deleting contact')
  try {
    const id = Number(req.params.id)

    const result = await ContactService.deleteContact(
      id,
      req.organizationId!  // ✅ typed
    )
    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
      data: result,
    })
  } catch (error: any) {
    logger.error(`Error deleting contact: ${error.message}`)
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete contact',
    })
  }
}