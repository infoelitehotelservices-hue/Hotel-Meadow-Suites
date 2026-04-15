import express from 'express'
import {createService, deleteService, fetchServices, updateService} from '../controllers/serviceController.js'
import { upload } from '../config/MulterConfig.js';
import { verifyAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/add-service", upload.single("logo"),verifyAdmin, createService);
router.get("/get-service",fetchServices);
router.put("/update-service/:id", upload.single("logo"),verifyAdmin, updateService);
router.delete("/delete-service/:id",verifyAdmin, deleteService);

export default router;