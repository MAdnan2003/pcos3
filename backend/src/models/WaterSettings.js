import mongoose from "mongoose";

const WaterSettingsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    dailyGoalMl: { type: Number, default: 2000, min: 500 },
    reminderIntervalMin: { type: Number, default: 60, min: 15 },
    remindersEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("WaterSettings", WaterSettingsSchema);
