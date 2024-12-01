import express from "express";

import { createCommunity, getAllCommunity, addPostToCommunity, getCommunityById, joinCommunity, getAllPostsInCommunity } from "../controllers/community.js";
import auth from "../middlewares/auth.js";
import upload from "../config/cloudinary.js";

const router = express.Router()

router.post("/create", auth, createCommunity)
router.get("/all", getAllCommunity)
router.post("/add", auth, upload.single('image'), addPostToCommunity)
router.get("/single/:_id", getCommunityById)
router.post("/join/:communityId", auth, joinCommunity)
router.get('/posts/:_id', getAllPostsInCommunity)

export default  router