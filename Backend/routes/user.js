import express from 'express';
import { deleteUser, forgotPassword, getUser, resendOtp, resetPassword, verifyAccount } from '../controllers/userController.js';
import { verifyTokenAndAuthorization } from '../middleware/verifyToken.js';

const router = express.Router();
router.get("/" ,verifyTokenAndAuthorization,getUser);
router.delete("/" ,verifyTokenAndAuthorization,deleteUser);
router.get("/verify/:otp", verifyAccount);
router.post("/resend-otp", resendOtp);

router.post("/reset-password", resetPassword);
router.delete("/:userId", deleteUser);

export default router;
