import mongoose from "mongoose";

const RoomtypeSchema = new mongoose.Schema({
    name : {
        type : String
    }
})

export default mongoose.model("Room_Type", RoomtypeSchema);