import express from "express";
import auth from "../middleware/auth.js";
import MedicalDetails from "../models/MedicalDetails.js";

const router = express.Router();

/* =========================
   GET SKINCARE ROUTINE
========================= */
router.get("/routine", auth, async (req, res) => {
  try {
    const medical = await MedicalDetails.findOne({ userId: req.userId });

    if (!medical) {
      return res.status(404).json({
        message: "Medical details not found"
      });
    }

    const routines = {
      acne: [
        "Gentle foaming cleanser (AM & PM)",
        "Niacinamide serum (AM)",
        "Oil-free moisturizer",
        "Salicylic acid (2–3x/week)",
        "Sunscreen SPF 50 (AM)"
      ],
      sensitive: [
        "Cream-based gentle cleanser",
        "Ceramide moisturizer",
        "Avoid fragrances",
        "Mineral sunscreen"
      ],
      hormonal: [
        "Low-pH cleanser",
        "Azelaic acid (PM)",
        "Light gel moisturizer",
        "Spot treatment for cystic acne"
      ]
    };

    // simple logic (can be improved later)
    const skinType =
      medical.symptoms.includes("Acne")
        ? "hormonal"
        : "sensitive";

    res.json({
      success: true,
      data: {
        skinType,
        routine: routines[skinType]
      }
    });

  } catch (err) {
    console.error("Skincare routine error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
