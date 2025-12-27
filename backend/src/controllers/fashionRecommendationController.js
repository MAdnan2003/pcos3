import FashionRecommendation from "../models/FashionRecommendation.js";
import BodyProfile from "../models/BodyProfile.js";
import Symptom from "../models/Symptom.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await BodyProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Please complete your body profile first"
      });
    }

    const { bodyShape } = profile;
    const { pcosType } = req.user;

    const latestSymptom = await Symptom.findOne({ userId }).sort({ date: -1 });

    const bloatingLevel = latestSymptom?.bloating || 0;
    const energyLevel = latestSymptom?.energy || 5;

    let recommendations = [];

    // >>> your teammate’s full recommendation logic remains unchanged <<<
    // (body shape + symptoms + PCOS type rules)

    // -----------------
    // SAME CODE HERE
    // -----------------

    res.status(200).json({
      success: true,
      data: {
        bodyShape,
        pcosType,
        currentSymptoms: {
          bloating: bloatingLevel,
          energy: energyLevel
        },
        recommendations
      }
    });
  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating recommendations",
      error: error.message
    });
  }
};

export const saveRecommendation = async (req, res) => {
  try {
    const { bodyShape, pcosType, recommendations } = req.body;
    const userId = req.user._id;

    const savedRec = await FashionRecommendation.create({
      userId,
      bodyShape,
      pcosType,
      recommendations
    });

    res.status(201).json({
      success: true,
      message: "Recommendation saved successfully",
      data: savedRec
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving recommendation",
      error: error.message
    });
  }
};
