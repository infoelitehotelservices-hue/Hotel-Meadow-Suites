import express from 'express'
import { createRoomtype, deleteRoomtype, getAllRoomtypes, updateRoomtype } from '../controllers/roomtypeController.js';
import { verifyAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/add-roomtype",verifyAdmin, createRoomtype);
router.get("/get-roomtype", getAllRoomtypes);
router.put("/update-roomtype/:id",verifyAdmin, updateRoomtype);
router.delete("/delete-roomtype/:id",verifyAdmin, deleteRoomtype);

export default router;