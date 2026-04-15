import express from "express";
import {
  createBooking,
  fetchBookings,
  updateBooking,
  cancelBooking,
  uploadPaymentProof,
  getRevenueData,
  getRecentBookings,
  getTotalRevenue,
  getPendingBookingsCount,
} from "../controllers/bookingController.js";
import { verifyTokenAndAuthorization } from "../middleware/verifyToken.js";
import { upload } from "../config/MulterConfig.js";

const router = express.Router();

router.post("/create", verifyTokenAndAuthorization, createBooking);
router.post("/:id/payment-proof", verifyTokenAndAuthorization, (req, res, next) => {
  req.query.folder = "payment-proofs";
  next();
}, upload.single("paymentProof"), uploadPaymentProof);
router.get("/", fetchBookings);
router.put("/:id", verifyTokenAndAuthorization, updateBooking);
router.delete("/:id", verifyTokenAndAuthorization, cancelBooking);
router.get('/revenue', getRevenueData);
router.get('/recent', getRecentBookings);
router.get('/total-revenue', getTotalRevenue);
router.get('/pending-count', getPendingBookingsCount);

export default router;
