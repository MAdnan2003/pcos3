import express from "express";
import auth from "../middleware/auth.js";
import WorkoutLog from "../models/WorkoutLog.js";

const router = express.Router();

/* =========================
   ADD WORKOUT LOG
========================= */
router.post("/", auth, async (req, res) => {
  try {
    const { date, type, duration } = req.body;

    if (!date || !type || !duration) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const log = await WorkoutLog.findOneAndUpdate(
      { userId: req.userId, date, type },
      { userId: req.userId, date, type, duration },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   GET USER STATS
========================= */
router.get("/stats", auth, async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ userId: req.userId }).sort({
      date: -1,
    });

    const totalWorkouts = logs.length;
    const totalMinutes = logs.reduce((a, b) => a + b.duration, 0);

    /* =========================
       STREAK = CONSECUTIVE DAYS ONLY
       (duplicates in same day ignored)
    ========================== */

    // unique workout days only
    const uniqueDays = [...new Set(logs.map(l => l.date))];

    // newest → oldest
    uniqueDays.sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;

    if (uniqueDays.length > 0) {
      streak = 1;
      let expectedDate = new Date(uniqueDays[0]);

      for (let i = 1; i < uniqueDays.length; i++) {
        expectedDate.setDate(expectedDate.getDate() - 1);

        const day = new Date(uniqueDays[i]);

        // streak continues only if dates are consecutive
        if (day.toDateString() === expectedDate.toDateString()) {
          streak++;
        } else {
          break;
        }
      }
    }

    /* =========================
       BADGES
    ========================== */
    let badge = "None";
    if (streak >= 30) badge = "🔥 30-Day Warrior";
    else if (streak >= 14) badge = "💪 2-Week Strong";
    else if (streak >= 7) badge = "🌟 7-Day Streak";

    res.json({
      success: true,
      data: {
        totalWorkouts,
        totalMinutes,
        streak,
        badge,
        logs, // returned for weekly progress bar
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
