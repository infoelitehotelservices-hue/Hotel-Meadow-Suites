import express from 'express';
const app = express();
import cors from 'cors'
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
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

mongoose.connect(process.env.MONGOURL)
.then(() => console.log("Hotel Database Connected"))
.catch((err) => console.log(err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
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

app.listen(process.env.PORT || 6013, () => console.log(`Hotel App running on port ${process.env.PORT}!`));