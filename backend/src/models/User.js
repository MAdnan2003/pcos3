import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    /* =====================
       BASIC AUTH INFO
    ===================== */
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    /* =====================
       ROLE (AUTO ASSIGNED)
    ===================== */
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },

    /* =====================
       ADMIN DASHBOARD FIELDS
    ===================== */
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active"
    },

    posts: {
      type: Number,
      default: 0
    },

    joinDate: {
      type: Date,
      default: Date.now
    },

    lastLogin: Date,

    /* =====================
       USER PROFILE (PCOS)
    ===================== */
    profile: {
      age: Number,
      weight: Number,
      height: Number,
      pcosType: {
        type: String,
        enum: [
          "insulin-resistant",
          "inflammatory",
          "adrenal",
          "post-pill",
          "not-diagnosed"
        ]
      },
      symptoms: [
        {
          type: String,
          enum: [
            "acne",
            "hair-fall",
            "weight-gain",
            "fatigue",
            "mood-swings",
            "irregular-periods"
          ]
        }
      ],
      sensitivities: [
        {
          type: String,
          enum: [
            "air-pollution",
            "weather-changes",
            "high-humidity",
            "extreme-temperatures"
          ]
        }
      ]
    },

    /* =====================
       LOCATION (ENVIRONMENT)
    ===================== */
    location: {
      city: String,
      country: String,
      latitude: Number,
      longitude: Number,
      timezone: String
    },

    /* =====================
       USER PREFERENCES
    ===================== */
    preferences: {
      alertsEnabled: {
        type: Boolean,
        default: true
      },
      notificationMethods: {
        type: [String],
        enum: ["in-app", "email", "push"],
        default: ["in-app"]
      },
      alertThresholds: {
        aqiLevel: {
          type: Number,
          default: 101
        },
        temperatureExtreme: {
          type: Number,
          default: 35
        },
        humidityHigh: {
          type: Number,
          default: 80
        }
      }
    }
  },
  {
    timestamps: true
  }
);

/* =====================
   AUTO ASSIGN ROLE
===================== */
userSchema.pre("save", function (next) {
  if (this.email?.toLowerCase().endsWith("@admin.com")) {
    this.role = "admin";
  } else {
    this.role = "user";
  }
  next();
});

/* =====================
   HASH PASSWORD
===================== */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* =====================
   COMPARE PASSWORD
===================== */
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
