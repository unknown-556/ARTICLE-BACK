import express from 'express'

import { addArticle, addComment, getAllPosts, getArticleById, getPostsByCategory, getRelated } from '../controllers/postController.js'
import auth from '../middlewares/auth.js'
import upload from '../config/cloudinary.js'

const router = express.Router()

router.post('/create', auth, upload.single('image'), addArticle)
router.post('/comment', auth, upload.single('image'), addComment)
router.get('/all', getAllPosts)
router.get('/single/:id', getArticleById)
router.get('/catrgory/:category', getPostsByCategory)
router.get('/related/:category', getRelated)

export default router
