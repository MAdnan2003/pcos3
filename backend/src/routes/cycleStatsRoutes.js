import express from "express";
import auth from "../middleware/auth.js";
import PeriodLog from "../models/PeriodLog.js";
import { calculateCycleStats } from "../services/cycleStatsService.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const logs = await PeriodLog.find({ userId: req.userId });
    const stats = calculateCycleStats(logs);

    res.json({ success: true, data: stats });
  } catch (err) {
    console.error("Cycle stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
