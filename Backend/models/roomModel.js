import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room_Type",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    availibility: {
      type: String,
      enum: ["available", "not available"],
      default: "available",
    },
    status: {
      type: String,
      enum: ["cleaning", "occupied", "maintenance", "vacant"],
      default: "vacant",
    },
    capacity: {
      type: Number,
      required: true,
    },
    size: {
        type: String,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    discountprice: {
        type: Number,
        default : null
    },
    amenities: {
       type: [mongoose.Schema.Types.ObjectId],
       ref: "Service",
    },
    images: {
        type: [String], 
        required: true,
    },
    displayOrder: {
        type: Number,
        default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
