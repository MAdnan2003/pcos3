import mongoose from "mongoose";

const bodyProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  measurements: {
    bust: Number,
    waist: Number,
    hips: Number,
    shoulders: Number,
    height: Number,
    weight: Number
  },
  bodyShape: {
    type: String,
    enum: [
      "Hourglass",
      "Pear",
      "Apple",
      "Rectangle",
      "Inverted Triangle",
      "Unknown"
    ],
    default: "Unknown"
  },
  preferences: {
    style: [String],
    colors: [String],
    fit: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const BodyProfile = mongoose.model("BodyProfile", bodyProfileSchema);
export default BodyProfile;
