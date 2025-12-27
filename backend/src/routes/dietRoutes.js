import express from "express";
import auth from "../middleware/auth.js";
import MedicalDetails from "../models/MedicalDetails.js";

const router = express.Router();

/* =========================
   GET PERSONALIZED DIET PLAN
========================= */
router.get("/plan", auth, async (req, res) => {
  try {
    const medical = await MedicalDetails.findOne({ userId: req.userId });

    if (!medical) {
      return res.status(404).json({
        message: "Medical details not found. Please fill medical details first."
      });
    }

    const plan = generateDietPlan(medical);

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error("Diet Plan Error:", error);
    res.status(500).json({ message: "Failed to generate diet plan" });
  }
});

/* =========================
   DIET PLAN LOGIC
========================= */
function generateDietPlan(medical) {
  const lowGI = [
    "Oats",
    "Quinoa",
    "Brown rice",
    "Sweet potato",
    "Lentils",
    "Chickpeas"
  ];

  const antiInflammatory = [
    "Spinach",
    "Broccoli",
    "Berries",
    "Turmeric",
    "Ginger",
    "Avocado",
    "Olive oil"
  ];

  const protein = medical.dietType === "Vegan"
    ? ["Tofu", "Tempeh", "Lentils"]
    : medical.dietType === "Vegetarian"
      ? ["Paneer", "Greek yogurt", "Eggs"]
      : ["Grilled chicken", "Fish", "Eggs"];

  return {
    breakfast: [
      "Oats with berries and flax seeds",
      "Green tea with ginger"
    ],
    lunch: [
      `Quinoa bowl with ${protein[0]} and vegetables`,
      "Mixed salad with olive oil dressing"
    ],
    dinner: [
      `Brown rice with ${protein[1]} and steamed broccoli`,
      "Turmeric soup"
    ],
    snacks: [
      "Handful of nuts",
      "Apple or berries"
    ],
    tips: [
      "Avoid refined sugar and white flour",
      "Eat every 3–4 hours to balance insulin",
      "Stay hydrated",
      medical.stressLevel === "High"
        ? "Include magnesium-rich foods to manage stress"
        : "Maintain balanced meals daily"
    ],
    focus: {
      lowGlycemicFoods: lowGI,
      antiInflammatoryFoods: antiInflammatory
    }
  };
}

export default router;
