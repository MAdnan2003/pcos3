import express from "express";
import auth from "../middleware/auth.js";
import MoodEntry from "../models/MoodEntry.js";

const router = express.Router();

/* ✅ GET mood entry for a date  */
router.get("/", auth, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: "date query required" });
    }

    const entry = await MoodEntry.findOne({ userId: req.userId, date });

    return res.json({ success: true, data: entry || null });
  } catch (err) {
    console.error("Mood GET error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ✅ CREATE or UPDATE mood entry for a date */
router.post("/", auth, async (req, res) => {
  try {
    const { date, mood, confidence, journal } = req.body;

    if (!date || !mood || !confidence) {
      return res.status(400).json({
        success: false,
        message: "date, mood, confidence are required",
      });
    }

    const updated = await MoodEntry.findOneAndUpdate(
      { userId: req.userId, date },
      {
        mood,
        confidence: Number(confidence),
        journal: journal || "",
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Mood entry saved",
      data: updated,
    });
  } catch (err) {
    console.error("Mood POST error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
