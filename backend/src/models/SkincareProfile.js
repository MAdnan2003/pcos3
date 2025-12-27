import mongoose from "mongoose";

const skincareProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },

    acneType: {
      type: String,
      enum: ["Hormonal", "Inflammatory", "Comedonal", "None"],
      required: true
    },

    sensitivity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("SkincareProfile", skincareProfileSchema);