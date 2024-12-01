import express from "express";
import authRoute from './authRoute.js'
import postRoute from './postRoute.js'
import userRoute from './userRoute.js'
import password from './password.js'
import adminRoute from './admin.js'
import communityRoute from  './community.js'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/post', postRoute)
router.use('/user', userRoute)
router.use('/password', password)
router.use('/admin', adminRoute)
router.use('/community', communityRoute)

export default router