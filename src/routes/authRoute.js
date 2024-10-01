import express from "express";
const router = express.Router()
import { signUp, signIn, getAllUsernames } from "../controllers/authController.js";

router.post("/register", signUp)
router.post("/login", signIn)
router.get("/usernames", getAllUsernames)

export default router