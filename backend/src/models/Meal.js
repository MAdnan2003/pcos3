import mongoose from "mongoose";

const MealSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Other"],
      default: "Other",
    },
    name: { type: String, required: true, trim: true },
    calories: { type: Number, required: true, min: 0 },
    time: { type: String, default: "" }, // HH:MM
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Meal", MealSchema);
