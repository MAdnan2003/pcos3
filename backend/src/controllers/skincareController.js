import SkincareProfile from "../models/SkincareProfile.js";

export const getSkincareRoutine = async (req, res) => {
  try {
    const profile = await SkincareProfile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(404).json({
        message: "Skincare profile not found"
      });
    }

    const routine = {
      morning: [],
      night: [],
      tips: []
    };

    // Acne logic
    if (profile.acneType === "Hormonal") {
      routine.morning.push("Gentle foaming cleanser", "Niacinamide serum", "Oil-free sunscreen");
      routine.night.push("Salicylic acid cleanser", "Azelaic acid", "Light gel moisturizer");
      routine.tips.push("Hormonal acne improves with consistent routines");
    }

    if (profile.acneType === "Inflammatory") {
      routine.morning.push("Calming cleanser", "Green tea serum", "Mineral sunscreen");
      routine.night.push("Low pH cleanser", "Centella cream");
      routine.tips.push("Avoid harsh exfoliants");
    }

    if (profile.acneType === "Comedonal") {
      routine.morning.push("Gel cleanser", "Niacinamide", "SPF 50");
      routine.night.push("BHA exfoliant (2x/week)", "Non-comedogenic moisturizer");
    }

    // Sensitivity logic
    if (profile.sensitivity === "High") {
      routine.tips.push("Patch test every new product");
      routine.tips.push("Avoid fragrance & alcohol");
    }

    res.json({ success: true, data: routine });
  } catch (err) {
    console.error("Skincare routine error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
