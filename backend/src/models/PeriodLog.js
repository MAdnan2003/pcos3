import mongoose from "mongoose";

const PeriodLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true
    },

    flow: {
      type: String,
      enum: ["spotting", "light", "medium", "heavy"],
      required: true
    },

    symptoms: {
      type: [String],
      default: []
    },

    notes: {
      type: String
    }
  },
  { timestamps: true }
);

// Prevent duplicate logs for same day
PeriodLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("PeriodLog", PeriodLogSchema);
