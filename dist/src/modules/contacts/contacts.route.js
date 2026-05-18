import { Router } from 'express';
import { createContact, getContacts, updateContact, deleteContact, } from './contacts.controller.js';
import { authMiddleware } from '../../auth/auth.middleware.js';
const router = Router();
router.use(authMiddleware);
router.get('/search', getContacts);
router.post('/', createContact);
router.get('/', getContacts);
// router.get('/:id', getContactById) 
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);
export default router;
