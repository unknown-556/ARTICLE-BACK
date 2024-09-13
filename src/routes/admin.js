import express from 'express'

import { getAllReports, getReport, getUser, getAllUsers, freezeAccount, unfreezeAccount, adminSignIn } from '../controllers/admin.js'
import { checkAdminRole } from '../middlewares/checkRole.js'

const router = express.Router()

router.post('/signin', adminSignIn)

router.get('/all', checkAdminRole('admin'), getAllUsers)
router.get('/user', checkAdminRole('admin'), getUser)
router.get('report', checkAdminRole('admin'), getReport)
router.get('/allReports', checkAdminRole('admin'), getAllReports)
router.put("/freeze/:id", checkAdminRole('admin'), freezeAccount);
router.put("/unfreeze/:id", checkAdminRole('admin'), unfreezeAccount)

export default router