import multer from "multer";
import path from "path";
import fs from "fs"; // Import File System
import { fileURLToPath } from "url";

// Fix for `__dirname` in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer Storage with Dynamic Destination
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Get folder name from query or body (fallback to "default" if not provided)
      const folder = req.query.folder || req.body.folder || "default";
  
      const uploadPath = path.join(__dirname, "../uploads", folder);
  
      // Check if the folder exists; create if missing
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
  
      cb(null, uploadPath); // Save files to the dynamic folder
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });
  

// Multer Upload Middleware
export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  },
});
