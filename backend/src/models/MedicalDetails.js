// backend/models/MedicalDetails.js
import mongoose from "mongoose";

const MedicalDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: String, 
      required: true,
      index: true, 
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    pcosType: {
      type: String,
      enum: [
        "Insulin-Resistant PCOS",
        "Inflammatory PCOS",
        "Post-Pill PCOS",
        "Adrenal PCOS",
        "Unknown / Not diagnosed yet",
      ],
      required: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    exerciseLevel: {
      type: String,
      enum: ["Sedentary", "Light", "Moderate", "Intense"],
      required: true,
    },
    dietType: {
      type: String,
      enum: [
        "Balanced",
        "Low-carb",
        "High-protein",
        "Vegetarian",
        "Vegan",
        "Other",
      ],
      required: true,
    },
    stressLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    smokingStatus: {
      type: String,
      enum: ["Non-smoker", "Occasional", "Regular"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MedicalDetails", MedicalDetailsSchema);
