import mongoose from "mongoose";

const MoodEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    date: { type: String, required: true, index: true }, // "YYYY-MM-DD"
    mood: {
      type: String,
      enum: ["Happy", "Calm", "Neutral", "Sad", "Anxious", "Stressed", "Angry", "Tired"],
      required: true,
    },
    confidence: { type: Number, min: 1, max: 10, required: true },
    journal: { type: String, maxlength: 500, default: "" },
  },
  { timestamps: true }
);

// ✅ only 1 entry per user per date
MoodEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("MoodEntry", MoodEntrySchema);
