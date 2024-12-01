import express from "express";

import { createCommunity, getAllCommunity, addPostToCommunity, getCommunityById, joinCommunity } from "../controllers/community.js";
import auth from "../middlewares/auth.js";

const router = express.Router()

router.post("/create", auth, createCommunity)
router.get("/all", getAllCommunity)
router.post("/add", auth, addPostToCommunity)
router.get("/single/:_id", getCommunityById)
router.post("/join/:communityId", auth, joinCommunity)

export default  router