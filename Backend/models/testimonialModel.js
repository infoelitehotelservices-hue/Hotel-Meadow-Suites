import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    designation: { type: String, default: "Guest review" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
