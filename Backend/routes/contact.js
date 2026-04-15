import express from 'express';
import { contactUs, getContact } from '../controllers/contactController.js';
import { verifyTokenAndAuthorization } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/contact-us' ,contactUs);
router.get('/get-contacts' , getContact);

export default router;