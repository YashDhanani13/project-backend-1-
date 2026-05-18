import * as ContactService from './contacts.service.js';
import logger from '../../utils/logger.js';
export const createContact = async (req, res) => {
    logger.info('Creating a new contact');
    try {
        const body = {
            ...req.body,
            organizationId: req.organizationId,
            createdBy: req.userId,
        };
        const result = await ContactService.createContact(body);
        res.status(201).json({
            success: true,
            message: 'Contact created successfully',
            data: result,
        });
    }
    catch (error) {
        logger.error(`Error creating contact: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create contact',
        });
    }
};
export const getContacts = async (req, res) => {
    logger.info('Retrieving contacts');
    try {
        const { search, field, value } = req.query;
        const result = await ContactService.getContacts(search, field, value, req.organizationId);
        res.status(200).json({
            success: true,
            message: 'Contacts retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        logger.error(`Error retrieving contacts: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get contacts',
        });
    }
};
// // contacts.controller.ts
// export const searchContacts = async (req: Request, res: Response) => {
//   try {
//     const { search } = req.query
//     const result = await ContactService.searchContacts(
//       search as string,
//       req.organizationId
//     )
//     res.status(200).json({
//       success: true,
//       message: "Contacts found",
//       data: result
//     })
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.status(500).json({
//         success: false,
//         message: error.message || "Search failed"
//       })
//     }
//   }
// }
export const updateContact = async (req, res) => {
    logger.info('Updating contact');
    try {
        const id = Number(req.params.id);
        const body = {
            ...req.body,
            updatedBy: req.userId,
            age: req.body.age ? Number(req.body.age) : undefined,
        };
        const result = await ContactService.updateContact(id, req.organizationId, body);
        res.status(200).json({
            success: true,
            message: 'Contact updated successfully',
            data: result,
        });
    }
    catch (error) {
        logger.error(`Error updating contact: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update contact',
        });
    }
};
export const deleteContact = async (req, res) => {
    logger.info('Deleting contact');
    try {
        const id = Number(req.params.id);
        const result = await ContactService.deleteContact(id, req.organizationId);
        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully',
            data: result,
        });
    }
    catch (error) {
        logger.error(`Error deleting contact: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to delete contact ',
        });
    }
};
