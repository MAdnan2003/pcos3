import mongoose from "mongoose";

const InsightSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "ℹ️" },
    text: { type: String, default: "" },
    type: { type: String, default: "info" }
  },
  { _id: false } // <- prevents subdocument _id + fixes cast errors
);

const progressReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // Time period
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // Streak data
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    streakTrend: { type: Number, default: 0 },

    // Mood data
    averageMood: { type: String, default: "😐" },
    moodTrend: { type: Number, default: 0 },

    moodData: {
      weekly: [
        {
          week: String,
          mood: Number,
          emoji: String
        }
      ]
    },

    journalCount: { type: Number, default: 0 },

    // Goal progress
    goalProgress: { type: Number, default: 0 },
    goalTrend: { type: Number, default: 0 },

    // Menstrual cycle data
    menstrualData: {
      currentDay: Number,
      cycleLength: Number,
      nextPeriod: String,
      dateRange: String,
      avgCycle: String,
      periodLength: String,
      regularity: String
    },

    // Exercise data
    exerciseData: {
      exercises: [
        {
          name: String,
          sessions: Number,
          color: String,
          icon: String
        }
      ],
      goal: Number,
      weeklyGoal: Number
    },

    // Diet data
    dietData: {
      calories: { consumed: Number, goal: Number },
      nutrition: [
        {
          label: String,
          value: Number,
          goal: Number,
          unit: String,
          color: String
        }
      ],
      waterIntake: { current: Number, goal: Number }
    },

    // Insights (STRUCTURED + VALID + SAFE)
    insights: {
      type: [InsightSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient querying
progressReportSchema.index({ userId: 1, endDate: -1 });

const ProgressReport = mongoose.model(
  "ProgressReport",
  progressReportSchema
);

export default ProgressReport;
