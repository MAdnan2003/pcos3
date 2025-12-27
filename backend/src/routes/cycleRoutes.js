import express from "express";
import auth from "../middleware/auth.js";
import PeriodLog from "../models/PeriodLog.js";

const router = express.Router();

/* =========================
   CREATE / UPDATE LOG
========================= */
router.post("/", auth, async (req, res) => {
  try {
    const { date, flow, symptoms, notes } = req.body;

    if (!date || !flow) {
      return res.status(400).json({ message: "Date and flow are required" });
    }

    const log = await PeriodLog.findOneAndUpdate(
      { userId: req.userId, date },
      {
        userId: req.userId,
        date,
        flow,
        symptoms: symptoms || [],
        notes
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, data: log });
  } catch (err) {
    console.error("Save period log error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   GET USER LOGS
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const logs = await PeriodLog.find({ userId: req.userId }).sort({
      date: -1
    });

    res.json({ success: true, data: logs });
  } catch (err) {
    console.error("Fetch logs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   DELETE LOG
========================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await PeriodLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Delete period log error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
