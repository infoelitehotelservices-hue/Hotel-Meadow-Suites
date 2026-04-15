import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import offersModel from "../models/offersModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addOffers = async (req, res) => {
    try {  
      if (!req.file) {
        return res.status(400).json({ status: false, message: "Image is required" });
      }
  
      // Save the offer to the database
      const offer = new offersModel({
        image: `uploads/${req.query.folder || req.body.folder}/${req.file.filename}`,
      });
      
      await offer.save();
  
      res.status(201).json({ status: true, message: "Offer created successfully", offer });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

export const fetchOffers = async (req, res) => {
    try {
        const offers = await offersModel.find();
        res.status(200).json({ status: true, offers });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const updateOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const { folder } = req.body; // Explicitly extract folder

        const offer = await offersModel.findById(id);
        if (!offer) {
            return res.status(404).json({ status: false, message: "Offer not found" });
        }

        // Prepare updated data
        let updatedData = {};

        if (req.file) {
            // Delete the old image
            const oldImagePath = path.join(__dirname, "..", offer.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            } else {
                console.log("Old image does not exist:", oldImagePath);
            }

            // Update image with new path
            updatedData.image = `uploads/${folder}/${req.file.filename}`;
        }

        const updatedOffer = await offersModel.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({
            status: true,
            message: "Offer updated successfully",
            updatedOffer,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message });
    }
};


// Delete a offer
export const deleteOffer = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ status: false, message: "Offer ID is required." });
      }
  
      const existingOffer = await offersModel.findById(id);
  
      if (!existingOffer) {
        return res.status(404).json({ status: false, message: "Offer not found." });
      }
  
      // Delete associated image
      if (existingOffer.image) { // Check if the image field exists
        // Construct the full path dynamically
        const filePath = path.join(__dirname, "..", existingOffer.image);
        
        try {
          // Check if file exists and then delete
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Deletes the file
            console.log('Deleted image:', existingOffer.image);
          } else {
            console.log('File does not exist:', filePath);
          }
        } catch (err) {
          console.error(`Failed to delete image ${existingOffer.image}:`, err);
        }
      }
  
      // Delete the offer from the database
      await offersModel.findByIdAndDelete(id);
  
      res.status(200).json({ status: true, message: "Offer and associated image deleted successfully." });
    } catch (error) {
      console.error("Error deleting Offer:", error);
      res.status(500).json({ status: false, message: "Internal Server Error." });
    }
  };