// backend/models/UserActivity.js
import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },

  // Exercise tracking
  exercise: {
    completed: { type: Boolean, default: false },
    type: { type: String, enum: ['cardio', 'yoga', 'strength', 'other'], default: 'other' },
    duration: { type: Number, default: 0 },
    calories: { type: Number, default: 0 }
  },

  // Mood tracking
  mood: {
    rating: { type: Number, min: 1, max: 5, default: 3 },
    emoji: { type: String, default: '😐' },
    confidence: { type: Number, default: 0 },
    journalEntry: { type: String, default: '' }
  },

  // Diet tracking
  diet: {
    meals: { type: [ { name: String, calories: Number, time: Date } ], default: [] },
    totalCalories: { type: Number, default: 0 },
    waterIntake: { type: Number, default: 0 },
    nutrition: {
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 }
    }
  },

  // Menstrual cycle
  menstrualCycle: {
    isPeriod: { type: Boolean, default: false },
    flow: { type: String, enum: ['light', 'medium', 'heavy'], default: 'light' },
    symptoms: { type: [String], default: [] }
  },

  // Weight and measurements
  measurements: {
    weight: { type: Number, default: 0 },
    bmi: { type: Number, default: 0 }
  },

  // Streak tracking
  streakDay: { type: Boolean, default: false },

  // Store original check-in data for reference
  checkInData: {
    tasks: { type: mongoose.Schema.Types.Mixed, default: {} },
    notes: { type: String, default: '' },
    completionPercentage: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Compound index for efficient date range queries
userActivitySchema.index({ userId: 1, date: -1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);
export default UserActivity;
