import roomModel from "../models/roomModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bookingModel from "../models/bookingModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createRoom = async (req, res) => {
  try {
    const { name, roomNumber, type, description, availibility, status, capacity, pricePerNight, size } = req.body;
    const amenities = JSON.parse(req.body.amenities);
    const discountprice = req.body.discountprice ? parseFloat(req.body.discountprice) : 0;
    
    if (!name || !roomNumber || !type || !description || !availibility || !status || !capacity || !pricePerNight || !amenities) {
      return res.status(400).json({ status: false, message: "Missing Fields" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: false, message: "Images are required" });
    }

    const images = req.files.map((file) => `uploads/${req.query.folder || req.body.folder}/${file.filename}`);

    const room = new roomModel({
      name,
      roomNumber,
      type,
      description,
      availibility,
      status,
      capacity,
      pricePerNight,
      discountprice,
      size,
      amenities,
      images,
    });

    await room.save();

    res.status(201).json({ status: true, message: "Room created successfully", room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const checkRoomNumber = async (req, res) => {
  const { roomNumber } = req.params;
  try {
    const room = await roomModel.findOne({ roomNumber });
    if (room) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: "Error checking room number." });
  }
}

export const fetchRooms = async (req, res) => {
  try {
    const rooms = await roomModel.find().populate('type').populate('amenities').sort({ displayOrder: 1, createdAt: 1 });
    res.status(200).json({ status: true, rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};


export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: false, message: "Room ID is required." });
    }

    const {
      name,
      roomNumber,
      type,
      description,
      availibility,
      status,
      capacity,
      pricePerNight,
      size,
      discountprice,
    } = req.body;

    const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : undefined;
    const imagesToKeep = req.body.imagesToKeep ? JSON.parse(req.body.imagesToKeep) : [];

    let images = [];
    if (req.files && req.files.length > 0) {
      const folder = req.query.folder || req.body.folder || "default";
      images = req.files.map((file) => `uploads/${folder}/${file.filename}`);
    }

    const existingRoom = await roomModel.findById(id);
    if (!existingRoom) {
      return res.status(404).json({ status: false, message: "Room not found." });
    }

    // Identify images to delete
    const imagesToDelete = (existingRoom.images || []).filter(
      (img) => !imagesToKeep.includes(img)
    );

    // Delete the images from the server
    for (const img of imagesToDelete) {
      const filePath = path.join(__dirname, "../uploads", img); // Adjust path based on your folder structure
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Prepare updated data
    const updatedData = {
      ...(name && { name }),
      ...(roomNumber && { roomNumber }),
      ...(type && { type }),
      ...(description && { description }),
      ...(availibility && { availibility }),
      ...(status && { status }),
      ...(capacity && { capacity }),
      ...(pricePerNight && { pricePerNight }),
      ...(discountprice && { discountprice }),
      ...(size && { size }),
      ...(amenities && { amenities }),
      images: [...imagesToKeep, ...images], // Combine kept and newly uploaded images
    };

    const room = await roomModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true });

    if (!room) {
      return res.status(404).json({ status: false, message: "Room not found." });
    }

    res.status(200).json({ status: true, message: "Room updated successfully.", room });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ status: false, message: "Internal Server Error." });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: false, message: "Room ID is required." });
    }

    const existingRoom = await roomModel.findById(id);

    if (!existingRoom) {
      return res.status(404).json({ status: false, message: "Room not found." });
    }

    // Delete associated images dynamically
    if (existingRoom.images && existingRoom.images.length > 0) {
      for (const img of existingRoom.images) {
        // Construct the full path dynamically
        const filePath = path.join(__dirname, "..", img);
        
        try {
          // Check if file exists and then delete
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Deletes the file
            console.log('Deleted image:', img);
          } else {
            console.log('File does not exist:', filePath);
          }
        } catch (err) {
          console.error(`Failed to delete image ${img}:`, err);
        }
      }
    }

    // Delete the room from the database
    await roomModel.findByIdAndDelete(id);

    res.status(200).json({ status: true, message: "Room and associated images deleted successfully." });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ status: false, message: "Internal Server Error." });
  }
};

export const filterAvailableRooms = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, capacity } = req.query;

    // Validate input
    if (!checkInDate || !checkOutDate || !capacity) {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    // Convert dates to ISO format
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return res.status(400).json({ status: false, message: "Check-out date must be after check-in date" });
    }

    // Step 1: Find all rooms with matching capacity
    const matchingRooms = await roomModel.find({
      capacity: { $gte: capacity }, // Ensure the room meets or exceeds the required capacity
      availibility: "available",
    }).populate('amenities');

    if (!matchingRooms || matchingRooms.length === 0) {
      return res.status(404).json({ status: false, message: "No rooms match the capacity criteria" });
    }

    // Step 2: Filter rooms with overlapping bookings
    const availableRooms = [];

    for (const room of matchingRooms) {
      const overlappingBooking = await bookingModel.findOne({
        room: room._id,
        $or: [
          { checkInDate: { $lt: checkOut, $gte: checkIn } }, // Check if any booking overlaps with the input range
          { checkOutDate: { $gt: checkIn, $lte: checkOut } },
          { checkInDate: { $lte: checkIn }, checkOutDate: { $gte: checkOut } }, // Booking fully spans the input range
        ],
      });

      if (!overlappingBooking) {
        availableRooms.push(room); // Add room to available list if no overlap
      }
    }

    // Step 3: Return the filtered list of rooms
    res.status(200).json({
      status: true,
      message: "Available rooms retrieved successfully",
      availableRooms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getRoomById =async (req,res) => {
  try {
    const rooms = await roomModel.findById(req.params.id).populate('type').populate('amenities');
    if(!rooms) return res.status(404).json({ status: false, message:"Room not found"});
    res.status(200).json({ status: true, message: "Room retrieved successfully", room: rooms });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
}


export const getRoomsByType = async (req, res) => {
    try {
        const { roomTypeId } = req.params; 
        const rooms = await roomModel.find({ type: roomTypeId }).populate('type').populate('amenities').sort({ displayOrder: 1, createdAt: 1 });

        
        res.status(200).json({ success: true, rooms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getRoomStatus = async (req, res) => {
  try {
    // Count booked rooms (confirmed bookings)
    const bookedRooms = await bookingModel.countDocuments({ bookingStatus: 'Confirmed' });

    // Count available rooms
    const availableRooms = await roomModel.countDocuments({ availibility: 'available' });

    // Count pending reservations
    const pendingReservations = await bookingModel.countDocuments({ bookingStatus: 'Pending' });

    // Prepare response
    const roomStatus = [
      { name: 'Rooms Booked', value: bookedRooms },
      { name: 'Available Rooms', value: availableRooms },
      { name: 'Pending Reservations', value: pendingReservations },
    ];

    res.status(200).json(roomStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching room status' });
  }
};

export const getOccupancyRate = async (req, res) => {
  try {
    const totalRooms = await roomModel.countDocuments();
    const today = new Date();

    const bookedRooms = await bookingModel.countDocuments({
      bookingStatus: 'Confirmed',
      checkInDate: { $lte: today },
      checkOutDate: { $gte: today },
    });

    const occupancyRate = totalRooms === 0 ? 0 : ((bookedRooms / totalRooms) * 100).toFixed(2);
    res.status(200).json({ occupancyRate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ occupancyRate: 0 }); // Return 0 in case of error
  }
};

export const updateRoomOrder = async (req, res) => {
  try {
    const { roomOrders } = req.body; // Array of { roomId, displayOrder }

    if (!roomOrders || !Array.isArray(roomOrders)) {
      return res.status(400).json({ status: false, message: "Invalid room order data" });
    }

    // Update each room's displayOrder
    const updatePromises = roomOrders.map(({ roomId, displayOrder }) =>
      roomModel.findByIdAndUpdate(roomId, { displayOrder }, { new: true })
    );

    await Promise.all(updatePromises);

    res.status(200).json({ status: true, message: "Room order updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

