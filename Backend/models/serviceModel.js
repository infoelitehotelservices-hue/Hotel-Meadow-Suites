import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    name : {
        type : String
    },
    logo: {
        type: String, // Store the file path of the uploaded logo
        required: true,
    },
})

export default mongoose.model("Service", ServiceSchema);