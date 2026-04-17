import express from 'express';
const app = express();
import cors from 'cors'
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import AuthRoute from './routes/auth.js';
import UserRoute from './routes/user.js';
import ServiceRoute from './routes/services.js';
import RoomtypeRoute from './routes/roomType.js';
import RoomRoute from './routes/room.js';
import bookingRoutes from "./routes/booking.js";
import offerRoutes from "./routes/offers.js";
import galleryRoutes from "./routes/gallery.js";
import contactRoutes from "./routes/contact.js";
import testimonialRoutes from "./routes/testimonial.js";
import { fileURLToPath } from "url";
import bodyParser from 'body-parser'

dotenv.config();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGOURL)
.then(() => console.log("Hotel Database Connected"))
.catch((err) => {
  console.error("MongoDB Connection Error:", err);
  process.exit(1);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/" , AuthRoute);
app.use("/api/users" , UserRoute);
app.use("/api/service" , ServiceRoute);
app.use("/api/roomtype" , RoomtypeRoute);
app.use("/api/room" , RoomRoute);
app.use("/api/bookings", bookingRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

app.listen(process.env.PORT || 6013, () => console.log(`Hotel App running on port ${process.env.PORT}!`));