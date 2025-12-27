import express from "express";
import auth from "../middleware/auth.js";
import MedicalDetails from "../models/MedicalDetails.js";
import WorkoutPlan from "../models/WorkoutPlan.js";
import { generateWorkoutPlan } from "../services/workoutPlanService.js";

const router = express.Router();

/* =========================
   GET WORKOUT PLAN (REGENERATE)
========================= */
router.get("/plan", auth, async (req, res) => {
  try {
    const medical = await MedicalDetails.findOne({ userId: req.userId });

    if (!medical) {
      return res.status(404).json({
        success: false,
        message: "Medical details missing",
      });
    }

    // 🔥 ALWAYS regenerate from latest medical data
    const plan = generateWorkoutPlan(medical);

    // Optional: keep a copy for history / analytics
    await WorkoutPlan.findOneAndUpdate(
      { userId: req.userId },
      { plan },
      { upsert: true }
    );

    res.json({ success: true, data: plan });
  } catch (err) {
    console.error("Workout plan error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
