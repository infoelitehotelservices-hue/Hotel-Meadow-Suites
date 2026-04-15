import testimonialModel from "../models/testimonialModel.js";

export const createTestimonial = async (req, res) => {
  try {
    const { name, review, rating, designation } = req.body;
    if (!name || !review || !rating) {
      return res.status(400).json({ status: false, message: "Name, review and rating are required" });
    }
    const image = req.file ? `/uploads/testimonials/${req.file.filename}` : "";
    const testimonial = await testimonialModel.create({ name, review, rating, designation, image });
    res.status(201).json({ status: true, message: "Testimonial created", testimonial });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialModel.find().sort({ createdAt: -1 });
    res.status(200).json({ status: true, testimonials });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, review, rating, designation } = req.body;
    const updateData = { name, review, rating, designation };
    if (req.file) updateData.image = `/uploads/testimonials/${req.file.filename}`;

    const testimonial = await testimonialModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!testimonial) return res.status(404).json({ status: false, message: "Testimonial not found" });

    res.status(200).json({ status: true, message: "Testimonial updated", testimonial });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await testimonialModel.findByIdAndDelete(id);
    if (!testimonial) return res.status(404).json({ status: false, message: "Testimonial not found" });
    res.status(200).json({ status: true, message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
