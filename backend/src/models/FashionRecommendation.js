import mongoose from "mongoose";

const fashionRecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  bodyShape: String,
  pcosType: String,
  recommendations: [
    {
      category: String,
      items: [String],
      tips: [String]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const FashionRecommendation = mongoose.model(
  "FashionRecommendation",
  fashionRecommendationSchema
);

export default FashionRecommendation;
