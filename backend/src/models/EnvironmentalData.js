import mongoose from "mongoose";

const environmentalDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    location: {
      city: String,
      country: String,
      latitude: Number,
      longitude: Number
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },

    weather: {
      temperature: Number,
      feelsLike: Number,
      humidity: Number,
      pressure: Number,
      weatherCondition: String,
      description: String,
      windSpeed: Number,
      uvIndex: Number
    },

    airQuality: {
      aqi: Number,
      aqiCategory: {
        type: String,
        enum: [
          "Good",
          "Moderate",
          "Unhealthy for Sensitive",
          "Unhealthy",
          "Very Unhealthy",
          "Hazardous"
        ]
      },
      pm25: Number,
      pm10: Number,
      o3: Number,
      no2: Number,
      so2: Number,
      co: Number
    },

    pollution: {
      overallLevel: {
        type: String,
        enum: ["Low", "Medium", "High", "Very High"]
      },
      sources: [String]
    },

    pcosImpact: {
      riskLevel: {
        type: String,
        enum: ["Low", "Moderate", "High", "Severe"]
      },
      affectedSymptoms: [
        {
          symptom: String,
          severity: String,
          likelihood: Number
        }
      ],
      recommendations: [String]
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient querying
environmentalDataSchema.index({ userId: 1, timestamp: -1 });
environmentalDataSchema.index({ "location.city": 1, timestamp: -1 });

export default mongoose.model(
  "EnvironmentalData",
  environmentalDataSchema
);
