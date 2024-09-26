import express from 'express'

import { addArticle, addComment, getAllPosts, getArticleById, getPostsByCategory, getPostsByUsername, getRelated } from '../controllers/postController.js'
import auth from '../middlewares/auth.js'
import upload from '../config/cloudinary.js'

const   router = express.Router()

router.post('/create', auth, upload.single('image'), addArticle)
router.post('/comment', auth, upload.single('image'), addComment)
router.get('/all', getAllPosts)
router.get('/single/:_id', getArticleById)
router.get('/catrgory/:category', getPostsByCategory)
router.get('/article/:_id', getPostsByUsername)
router.get('/related/:categories', getRelated)

export default router
