import Service from "../models/serviceModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createService = async (req, res) => {
    try {  
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ status: false, message: "Name is required" });
      }
  
      if (!req.file) {
        return res.status(400).json({ status: false, message: "Logo is required" });
      }
  
      // Save the service to the database
      const service = new Service({
        name,
        logo: `uploads/${req.query.folder || req.body.folder}/${req.file.filename}`,
      });
      
      await service.save();
  
      res.status(201).json({ status: true, message: "Service created successfully", service });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  
export const fetchServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json({ status: true, services });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const updateService = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, folder } = req.body; // Explicitly extract folder
  
      if (!name) {
        return res.status(400).json({ status: false, message: "Name is required" });
      }
  
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ status: false, message: "Service not found" });
      }
  
      // Prepare updated data
      const updatedData = { name };
  
      if (req.file) {
        // Delete the old image
        const oldImagePath = path.join(__dirname, "../uploads", service.logo);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
  
        // Update logo with new path
        updatedData.logo = `uploads/${folder}/${req.file.filename}`;
      }
  
      const updatedService = await Service.findByIdAndUpdate(id, updatedData, { new: true });
  
      res.status(200).json({
        status: true,
        message: "Service updated successfully",
        updatedService,
      });
    } catch (error) {
        console.log(error);
      res.status(500).json({ status: false, message: error.message });
    }
  };
  

// Delete a service
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ status: false, message: "Service not found" });
        }

        res.status(200).json({ status: true, message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};
