// backend/routes/dailyCheckIn.js
import express from 'express';
import UserActivity from '../models/UserActivity.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/daily-checkin
// @desc    Save daily check-in
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { date, tasks, notes } = req.body;
    const userId = req.user.id;

    let activity = await UserActivity.findOne({
      userId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      }
    });

    const activityData = {
      userId,
      date: new Date(date),
      exercise: {
        completed: tasks.exerciseDone,
        type: tasks.exerciseType,
        duration: tasks.exerciseDuration,
        calories: tasks.exerciseDuration * 5
      },
      mood: {
        rating: tasks.moodRating,
        emoji: tasks.moodEmoji,
        confidence: tasks.moodRating * 2,
        journalEntry: tasks.journalWritten ? notes : null
      },
      diet: {
        meals: [
          tasks.breakfastEaten ? { name: 'Breakfast', calories: 400, time: new Date() } : null,
          tasks.lunchEaten ? { name: 'Lunch', calories: 600, time: new Date() } : null,
          tasks.dinnerEaten ? { name: 'Dinner', calories: 700, time: new Date() } : null
        ].filter(Boolean),
        totalCalories: 
          (tasks.breakfastEaten ? 400 : 0) + 
          (tasks.lunchEaten ? 600 : 0) + 
          (tasks.dinnerEaten ? 700 : 0),
        waterIntake: tasks.waterGlasses,
        nutrition: {
          protein: 60,
          carbs: 180,
          fats: 50
        }
      },
      menstrualCycle: {
        isPeriod: tasks.periodTracked,
        symptoms: tasks.symptomsTracked ? ['tracked'] : []
      },
      streakDay: calculateStreakDay(tasks),
      checkInData: {
        tasks,
        notes,
        completionPercentage: calculateCompletion(tasks)
      }
    };

    if (activity) {
      Object.assign(activity, activityData);
      await activity.save();
    } else {
      activity = new UserActivity(activityData);
      await activity.save();
    }

    res.json({ 
      message: 'Daily check-in saved successfully', 
      activity,
      completionPercentage: calculateCompletion(tasks)
    });
  } catch (error) {
    console.error('Error saving daily check-in:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/daily-checkin/:date
// @desc    Get check-in for specific date
// @access  Private
router.get('/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;

    const activity = await UserActivity.findOne({
      userId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      }
    });

    if (!activity) {
      return res.status(404).json({ message: 'No check-in found for this date' });
    }

    res.json({
      date: activity.date,
      tasks: activity.checkInData?.tasks || reconstructTasks(activity),
      notes: activity.checkInData?.notes || activity.mood?.journalEntry || ''
    });
  } catch (error) {
    console.error('Error fetching check-in:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

function calculateStreakDay(tasks) {
  const completedTasks = [
    tasks.exerciseDone,
    tasks.moodLogged,
    tasks.breakfastEaten,
    tasks.lunchEaten,
    tasks.dinnerEaten,
    tasks.waterGoalMet
  ].filter(Boolean).length;

  return completedTasks >= 4;
}

function calculateCompletion(tasks) {
  const totalTasks = [
    tasks.exerciseDone,
    tasks.moodLogged,
    tasks.journalWritten,
    tasks.breakfastEaten,
    tasks.lunchEaten,
    tasks.dinnerEaten,
    tasks.waterGoalMet,
    tasks.medicationTaken,
    tasks.symptomsTracked,
    tasks.skinCareRoutine
  ];
  
  const completed = totalTasks.filter(Boolean).length;
  return Math.round((completed / totalTasks.length) * 100);
}

function reconstructTasks(activity) {
  return {
    exerciseDone: activity.exercise?.completed || false,
    exerciseType: activity.exercise?.type || 'cardio',
    exerciseDuration: activity.exercise?.duration || 30,
    moodLogged: activity.mood?.rating ? true : false,
    moodRating: activity.mood?.rating || 3,
    moodEmoji: activity.mood?.emoji || '😐',
    journalWritten: activity.mood?.journalEntry ? true : false,
    breakfastEaten: activity.diet?.meals?.some(m => m.name === 'Breakfast') || false,
    lunchEaten: activity.diet?.meals?.some(m => m.name === 'Lunch') || false,
    dinnerEaten: activity.diet?.meals?.some(m => m.name === 'Dinner') || false,
    waterGoalMet: activity.diet?.waterIntake >= 8,
    waterGlasses: activity.diet?.waterIntake || 0,
    medicationTaken: false,
    symptomsTracked: activity.menstrualCycle?.symptoms?.length > 0,
    periodTracked: activity.menstrualCycle?.isPeriod || false,
    skinCareRoutine: false,
    sleepQuality: 3,
    stressLevel: 3
  };
}

export default router;
