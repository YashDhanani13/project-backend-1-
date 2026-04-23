import { Router } from 'express'
import {
    createEmployee,
    getEmployee,
    updateEmployee,
    deleteEmployee,
   
} from './employee.controller.js'

import { authMiddleware } from '../../auth/auth.middleware.js'

const router = Router()
router.use(authMiddleware)

// router.get('/search', getEmployee)
router.post('/', createEmployee)
router.get('/', getEmployee)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)

export default router
