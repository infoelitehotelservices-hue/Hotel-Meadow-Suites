import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import galleryModel from "../models/galleryModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addGallery = async (req, res) => {
    try {  
      if (!req.file) {
        return res.status(400).json({ status: false, message: "Image is required" });
      }
  
      // Save the gallery to the database
      const gallery = new galleryModel({
        image: `uploads/${req.query.folder || req.body.folder}/${req.file.filename}`,
      });
      
      await gallery.save();
  
      res.status(201).json({ status: true, message: "Gallery created successfully", gallery });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

// Bulk upload gallery images
export const bulkAddGallery = async (req, res) => {
    try {  
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ status: false, message: "At least one image is required" });
      }
  
      const folder = req.query.folder || req.body.folder || "gallery-images";
      const galleryItems = [];
  
      // Create gallery entries for each uploaded image
      for (const file of req.files) {
        const gallery = new galleryModel({
          image: `uploads/${folder}/${file.filename}`,
        });
        
        const savedGallery = await gallery.save();
        galleryItems.push(savedGallery);
      }
  
      res.status(201).json({ 
        status: true, 
        message: `${galleryItems.length} image(s) uploaded successfully`, 
        gallery: galleryItems 
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

export const fetchGallery = async (req, res) => {
    try {
        const gallery = await galleryModel.find();
        res.status(200).json({ status: true, gallery });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const updateGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const { folder } = req.body; // Explicitly extract folder

        const gallery = await galleryModel.findById(id);
        if (!gallery) {
            return res.status(404).json({ status: false, message: "Gallery not found" });
        }

        // Prepare updated data
        let updatedData = {};

        if (req.file) {
            // Delete the old image
            const oldImagePath = path.join(__dirname, "..", gallery.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            } else {
                console.log("Old image does not exist:", oldImagePath);
            }

            // Update image with new path
            updatedData.image = `uploads/${folder}/${req.file.filename}`;
        }

        const updatedGallery = await galleryModel.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({
            status: true,
            message: "gallery updated successfully",
            updatedGallery,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message });
    }
};


// Delete a gallery
export const deleteGallery = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ status: false, message: "Gallery ID is required." });
      }
  
      const existingGallery = await galleryModel.findById(id);
  
      if (!existingGallery) {
        return res.status(404).json({ status: false, message: "Gallery not found." });
      }
  
      // Delete associated image
      if (existingGallery.image) { // Check if the image field exists
        // Construct the full path dynamically
        const filePath = path.join(__dirname, "..", existingGallery.image);
        
        try {
          // Check if file exists and then delete
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Deletes the file
            console.log('Deleted image:', existingGallery.image);
          } else {
            console.log('File does not exist:', filePath);
          }
        } catch (err) {
          console.error(`Failed to delete image ${existingGallery.image}:`, err);
        }
      }
  
      // Delete the gallery from the database
      await galleryModel.findByIdAndDelete(id);
  
      res.status(200).json({ status: true, message: "gallery and associated image deleted successfully." });
    } catch (error) {
      console.error("Error deleting gallery:", error);
      res.status(500).json({ status: false, message: "Internal Server Error." });
    }
  };