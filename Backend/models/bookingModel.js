import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, 
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    number: { type: String, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    bookingStatus: { type: String, enum: ["Confirmed", "Cancelled", "Pending"], default: "Pending" },
    paymentProof: { type: String, default: null },
  },
  { timestamps: true }
);

const bookingModel = mongoose.model("Booking", bookingSchema);

export default bookingModel;
