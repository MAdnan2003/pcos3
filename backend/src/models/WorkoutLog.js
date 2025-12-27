import mongoose from "mongoose";

const WorkoutLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    type: {
      type: String,
      enum: ["yoga", "strength", "cardio"],
      required: true,
    },
    duration: {
      type: Number, // minutes
      required: true,
    },
  },
  { timestamps: true }
);

// one log per workout type per day
WorkoutLogSchema.index({ userId: 1, date: 1, type: 1 }, { unique: true });

export default mongoose.model("WorkoutLog", WorkoutLogSchema);
