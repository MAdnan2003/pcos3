import mongoose from "mongoose";

const WorkoutPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    plan: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("WorkoutPlan", WorkoutPlanSchema);
