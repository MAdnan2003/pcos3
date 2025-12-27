import mongoose from "mongoose";

const WaterLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true }, 
    amountMl: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("WaterLog", WaterLogSchema);
