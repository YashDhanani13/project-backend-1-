import * as employeeService from './employee.service.js';
import logger from '../../utils/logger.js';
//create :-
export const createEmployee = async (req, res) => {
    logger.info('Creating a new employee');
    try {
        const body = {
            ...req.body,
            organizationId: req.organizationId,
            createdBy: req.userId,
        };
        const result = await employeeService.createEmployee(body);
        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: result,
        });
    }
    catch (error) {
        logger.error(`Error creating employee: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create employee',
        });
    }
};
export const getEmployee = async (req, res) => {
    logger.info('Retrieving contacts');
    try {
        // const userReq = req as any
        const { search, field, value } = req.query;
        const result = await employeeService.getEmployee(search, field, value, req.organizationId);
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
export const updateEmployee = async (req, res) => {
    logger.info('Updating employee');
    try {
        const id = Number(req.params.id);
        const body = {
            ...req.body,
            updatedBy: req.userId,
            age: req.body.age ? Number(req.body.age) : undefined,
        };
        const result = await employeeService.updateEmployee(id, req.organizationId, body);
        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: result,
        });
    }
    catch (error) {
        logger.error(`Error updating employee: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update Employee',
        });
    }
};
export const deleteEmployee = async (req, res) => {
    logger.info('Deleting employee');
    try {
        // const userReq = req as any
        const id = Number(req.params.id);
        const result = await employeeService.deleteEmployee(id, req.organizationId);
        res.status(200).json({
            success: true,
            message: 'Employee deleted successfully',
            data: result,
        });
    }
    catch (error) {
        logger.error(`Error deleting employee: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to delete Employee',
        });
    }
};
