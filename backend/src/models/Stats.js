import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
    title: { type: String, required: true },  
    value: { type: Number, required: true }
});

export default mongoose.model("Stats", statsSchema);
