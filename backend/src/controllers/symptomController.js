import Symptom from '../models/Symptom.js';

// @desc    Save daily symptoms
// @route   POST /api/symptoms
// @access  Private
export const saveSymptoms = async (req, res) => {
  try {
    const { bloating, energy, mood, bodyChanges } = req.body;
    const userId = req.user._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let symptom = await Symptom.findOne({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (symptom) {
      symptom.bloating = bloating;
      symptom.energy = energy;
      symptom.mood = mood;
      symptom.bodyChanges = bodyChanges;
    } else {
      symptom = new Symptom({
        userId,
        bloating,
        energy,
        mood,
        bodyChanges,
      });
    }

    await symptom.save();

    res.status(200).json({
      success: true,
      message: 'Symptoms saved successfully',
      data: symptom,
    });
  } catch (error) {
    console.error('Symptom Save Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving symptoms',
      error: error.message,
    });
  }
};

// @desc    Get latest symptoms
// @route   GET /api/symptoms/latest
// @access  Private
export const getLatestSymptoms = async (req, res) => {
  try {
    const symptom = await Symptom.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: 'No symptoms tracked yet',
      });
    }

    res.status(200).json({
      success: true,
      data: symptom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving symptoms',
      error: error.message,
    });
  }
};
