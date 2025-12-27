import express from "express";
import auth from "../middleware/auth.js";
import Meal from "../models/Meal.js";

const router = express.Router();


router.post("/", auth, async (req, res) => {
  try {
    const { date, mealType, name, calories, time, notes } = req.body;

    if (!date || !name || calories === undefined) {
      return res.status(400).json({
        success: false,
        message: "date, name and calories are required",
      });
    }

    const meal = await Meal.create({
      userId: req.userId,
      date,
      mealType: mealType || "Other",
      name: name.trim(),
      calories: Number(calories),
      time: time || "",
      notes: notes || "",
    });

    return res.status(201).json({
      success: true,
      message: "Meal added successfully",
      data: meal,
    });
  } catch (err) {
    console.error("Meal create error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date query required (YYYY-MM-DD)",
      });
    }

    const meals = await Meal.find({ userId: req.userId, date }).sort({
      createdAt: -1,
    });

    const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);

    return res.json({
      success: true,
      data: { meals, totalCalories },
    });
  } catch (err) {
    console.error("Meal fetch error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Meal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Meal not found" });
    }

    return res.json({ success: true, message: "Meal deleted" });
  } catch (err) {
    console.error("Meal delete error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
