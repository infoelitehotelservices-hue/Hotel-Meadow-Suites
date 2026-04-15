import express from 'express'
import { upload } from '../config/MulterConfig.js';
import { verifyAdmin, verifyTokenAndAuthorization } from '../middleware/verifyToken.js';
import { addOffers, deleteOffer, fetchOffers, updateOffer } from '../controllers/offerController.js';

const router = express.Router();

router.post("/add-offer", upload.single("image"),verifyAdmin,verifyTokenAndAuthorization, addOffers);
router.get("/get-offer",fetchOffers);
router.put("/update-offer/:id", upload.single("image"),verifyAdmin, verifyTokenAndAuthorization,updateOffer);
router.delete("/delete-offer/:id",verifyAdmin,verifyTokenAndAuthorization, deleteOffer);

export default router;