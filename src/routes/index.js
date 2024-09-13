import express from "express";
import authRoute from './authRoute.js'
import postRoute from './postRoute.js'
import userRoute from './userRoute.js'
import password from './password.js'
import adminRoute from './admin.js'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/post', postRoute)
router.use('/user', userRoute)
router.use('/password', password)
router.use('/admin', adminRoute)

export default router