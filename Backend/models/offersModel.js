import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
    image: {
        type: String, 
        required: true,
    },
})

export default mongoose.model("Offer", OfferSchema);