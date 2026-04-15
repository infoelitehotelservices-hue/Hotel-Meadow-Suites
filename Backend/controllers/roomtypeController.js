import roomtypeModel from "../models/roomtypeModel.js";

// Create a new RoomType
export const createRoomtype = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ status: false, message: "Name is required" });
    }

    // Save the RoomType to the database
    const newRoomType = new roomtypeModel({ name });
    await newRoomType.save();

    res.status(201).json({ status: true, message: "RoomType created successfully", roomtype: newRoomType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Fetch all RoomTypes
export const getAllRoomtypes = async (req, res) => {
  try {
    const roomtypes = await roomtypeModel.find();
    res.status(200).json({ status: true, roomtypes });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a RoomType
export const updateRoomtype = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ status: false, message: "Name is required" });
    }

    const updatedRoomType = await roomtypeModel.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedRoomType) {
      return res.status(404).json({ status: false, message: "RoomType not found" });
    }

    res.status(200).json({ status: true, message: "RoomType updated successfully", roomtype: updatedRoomType });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a RoomType
export const deleteRoomtype = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoomType = await roomtypeModel.findByIdAndDelete(id);

    if (!deletedRoomType) {
      return res.status(404).json({ status: false, message: "RoomType not found" });
    }

    res.status(200).json({ status: true, message: "RoomType deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
