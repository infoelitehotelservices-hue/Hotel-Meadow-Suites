import { createUser, loginUser } from "../controllers/authController.js";
import express from 'express'

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);

export default router;