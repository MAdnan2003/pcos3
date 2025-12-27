import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ["air-quality", "weather", "pollution", "combined"],
      required: true
    },

    severity: {
      type: String,
      enum: ["info", "warning", "danger", "critical"],
      required: true
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    details: {
      currentAQI: Number,
      temperature: Number,
      humidity: Number,
      pollutants: [String],
      affectedSymptoms: [String]
    },

    recommendations: [
      {
        action: String,
        priority: String,
        icon: String
      }
    ],

    location: {
      city: String,
      country: String
    },

    isRead: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    },

    triggeredAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Indexes (UNCHANGED)
alertSchema.index({ userId: 1, isActive: 1, triggeredAt: -1 });
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Alert", alertSchema);
