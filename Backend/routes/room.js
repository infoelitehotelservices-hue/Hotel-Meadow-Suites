import express from 'express'
import { upload } from '../config/MulterConfig.js';
import {checkRoomNumber, createRoom, deleteRoom, fetchRooms, filterAvailableRooms, getOccupancyRate, getRoomById, getRoomsByType, getRoomStatus, updateRoom, updateRoomOrder } from '../controllers/roomController.js';
import { verifyAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/add-room", upload.array("images" , 5), createRoom);
router.get("/check-room-number/:roomNumber", checkRoomNumber);
router.get("/get-room",fetchRooms);
router.put("/update-room/:id",  upload.array("images" , 5), updateRoom);
router.put("/update-room-order", updateRoomOrder);
router.delete('/delete-room/:id', deleteRoom);
router.get('/check-room', filterAvailableRooms);
router.get('/get-room/:id' , getRoomById);
router.get('/rooms/:roomTypeId', getRoomsByType);
router.get('/status', getRoomStatus);
router.get('/occupancy-rate', getOccupancyRate);


export default router;