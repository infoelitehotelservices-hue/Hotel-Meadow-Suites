import express from "express";
import { createTestimonial, deleteTestimonial, getTestimonials, updateTestimonial } from "../controllers/testimonialController.js";
import { upload } from "../config/MulterConfig.js";
import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getTestimonials);
router.post("/", verifyAdmin, upload.single("image"), createTestimonial);
router.put("/:id", verifyAdmin, upload.single("image"), updateTestimonial);
router.delete("/:id", verifyAdmin, deleteTestimonial);

export default router;
