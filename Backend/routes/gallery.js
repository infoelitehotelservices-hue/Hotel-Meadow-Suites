import express from 'express'
import { upload } from '../config/MulterConfig.js';
import { verifyAdmin, verifyTokenAndAuthorization } from '../middleware/verifyToken.js';
import { addOffers, deleteOffer, fetchOffers, updateOffer } from '../controllers/offerController.js';
import { addGallery, bulkAddGallery, deleteGallery, fetchGallery, updateGallery } from '../controllers/galleryController.js';

const router = express.Router();

router.post("/add-gallery", upload.single("image"),verifyAdmin,verifyTokenAndAuthorization, addGallery);
router.post("/bulk-add-gallery", upload.array("images", 50),verifyAdmin,verifyTokenAndAuthorization, bulkAddGallery);
router.get("/get-gallery",fetchGallery);
router.put("/update-gallery/:id", upload.single("image"),verifyAdmin, verifyTokenAndAuthorization,updateGallery);
router.delete("/delete-gallery/:id",verifyAdmin,verifyTokenAndAuthorization, deleteGallery);

export default router;