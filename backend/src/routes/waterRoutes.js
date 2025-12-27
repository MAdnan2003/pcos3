import express from "express";
import auth from "../middleware/auth.js";
import WaterLog from "../models/WaterLog.js";
import WaterSettings from "../models/WaterSettings.js";

const router = express.Router();


router.get("/settings", auth, async (req, res) => {
  try {
    let settings = await WaterSettings.findOne({ userId: req.userId });
    if (!settings) settings = await WaterSettings.create({ userId: req.userId });

    return res.json({ success: true, data: settings });
  } catch (err) {
    console.error("Water settings error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.put("/settings", auth, async (req, res) => {
  try {
    const { dailyGoalMl, reminderIntervalMin, remindersEnabled } = req.body;

    const settings = await WaterSettings.findOneAndUpdate(
      { userId: req.userId },
      {
        dailyGoalMl: Number(dailyGoalMl),
        reminderIntervalMin: Number(reminderIntervalMin),
        remindersEnabled: Boolean(remindersEnabled),
      },
      { new: true, upsert: true }
    );

    return res.json({ success: true, message: "Settings updated", data: settings });
  } catch (err) {
    console.error("Water update error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/log", auth, async (req, res) => {
  try {
    const { date, amountMl } = req.body;

    if (!date || !amountMl) {
      return res.status(400).json({
        success: false,
        message: "date and amountMl are required",
      });
    }

    const log = await WaterLog.create({
      userId: req.userId,
      date,
      amountMl: Number(amountMl),
    });

    return res.status(201).json({ success: true, message: "Water logged", data: log });
  } catch (err) {
    console.error("Water log error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.get("/summary", auth, async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: "date query required" });
    }

    const logs = await WaterLog.find({ userId: req.userId, date }).sort({ createdAt: -1 });
    const totalMl = logs.reduce((sum, l) => sum + (l.amountMl || 0), 0);

    return res.json({ success: true, data: { logs, totalMl } });
  } catch (err) {
    console.error("Water summary error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

