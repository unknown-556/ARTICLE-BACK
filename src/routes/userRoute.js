import express from 'express'

import {getUserById, myArticles, bookmarkArticle, addToLibrary, getBookmarks, getLibrary, followAndUnfollow, getFollowingArticles, getNotifications, updateProfilePic, markAllNotificationsAsRead, markNotificationAsRead, getUser } from '../controllers/userController.js'
import auth from '../middlewares/auth.js'
import upload from '../config/cloudinary.js'

const router = express.Router()

router.get('/user/:_id', getUser)

router.get('/profile', auth, getUserById)
router.put('/update', auth, upload.single('profilePic'), updateProfilePic);
router.get('/myArticles', auth, myArticles)
router.post('/bookmark/:articleId', auth, bookmarkArticle);
router.post('/library/:articleId', auth, addToLibrary);
router.get('/bookmarks', auth, getBookmarks)
router.get('/myLibrary', auth, getLibrary)
router.post("/follow/:id", auth, followAndUnfollow);
router.get("/following", auth, getFollowingArticles);
router.get('/notifications', auth, getNotifications);
router.post('/notifications/mark-all-as-read', markAllNotificationsAsRead);
router.post('/notifications/:notificationId/mark-as-read', markNotificationAsRead);

export default router