import ProgressReport from '../models/ProgressReport.js';
import UserActivity from '../models/UserActivity.js';

// =========================
// HELPER FUNCTIONS
// =========================

// Get date range
const getDateRange = (timeRange) => {
  const endDate = new Date();
  const startDate = new Date();

  switch (timeRange) {
    case '7':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case '365':
      startDate.setDate(endDate.getDate() - 365);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
  }

  return { startDate, endDate };
};

// Calculate streak from daily check-ins
const calculateStreak = async (userId, endDate) => {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate = null;

  const activities = await UserActivity.find({
    userId,
    date: { $lte: endDate },
    streakDay: true
  }).sort({ date: -1 });

  for (const activity of activities) {
    const activityDate = new Date(activity.date);

    if (!lastDate) {
      tempStreak = currentStreak = longestStreak = 1;
    } else {
      const dayDiff = Math.floor((lastDate - activityDate) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        tempStreak++;
        currentStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else if (dayDiff > 1) {
        currentStreak = 0;
        tempStreak = 1;
        longestStreak = Math.max(longestStreak, tempStreak);
      }
    }

    lastDate = activityDate;
  }

  if (lastDate && activities.length > 0) {
    const daysSinceLastActivity = Math.floor((endDate - lastDate) / (1000 * 60 * 60 * 24));
    if (daysSinceLastActivity > 1) currentStreak = 0;
  }

  return {
    currentStreak: currentStreak || 0,
    longestStreak: longestStreak || 0
  };
};

// Calculate mood data
const calculateMoodData = async (userId, startDate, endDate) => {
  const activities = await UserActivity.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
    'mood.rating': { $exists: true }
  }).sort({ date: 1 });

  if (!activities.length) {
    return {
      averageMood: '😐',
      moodData: { weekly: [] },
      journalCount: 0,
      moodTrend: 0
    };
  }

  const weeklyMood = {};
  let totalMood = 0;
  let moodCount = 0;
  let journalCount = 0;

  activities.forEach((activity, index) => {
    const weekNum = Math.floor(index / 7) + 1;
    const weekKey = `Week ${weekNum}`;
    if (!weeklyMood[weekKey]) weeklyMood[weekKey] = { total: 0, count: 0 };

    const rating = activity.mood.rating || 3;

    weeklyMood[weekKey].total += rating;
    weeklyMood[weekKey].count++;

    totalMood += rating;
    moodCount++;

    if (activity.mood.journalEntry?.trim()) journalCount++;
  });

  const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];
  const avgMoodRating = moodCount ? Math.round(totalMood / moodCount) : 3;

  const weekly = Object.keys(weeklyMood).map((week) => {
    const avg = weeklyMood[week].total / weeklyMood[week].count;
    return {
      week,
      mood: Math.round(avg * 20),
      emoji: moodEmojis[Math.round(avg) - 1] || '😐'
    };
  });

  let moodTrend = 0;
  if (weekly.length >= 2) {
    const firstWeekAvg = weekly[0].mood;
    const lastWeekAvg = weekly[weekly.length - 1].mood;
    moodTrend = Math.round(((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100);
  }

  return {
    averageMood: moodEmojis[avgMoodRating - 1] || '😐',
    moodData: { weekly },
    journalCount,
    moodTrend
  };
};

// Exercise data
const calculateExerciseData = async (userId, startDate, endDate) => {
  const activities = await UserActivity.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
    'exercise.completed': true
  });

  if (!activities.length) {
    return {
      exercises: [],
      goal: 20,
      weeklyGoal: 5
    };
  }

  const exerciseTypes = {};
  activities.forEach((activity) => {
    const type = activity.exercise.type || 'other';
    exerciseTypes[type] = (exerciseTypes[type] || 0) + 1;
  });

  const exerciseIcons = {
    cardio: '🏃',
    yoga: '🧘',
    strength: '💪',
    other: '🏋️'
  };

  const exerciseColors = {
    cardio: '#10b981',
    yoga: '#8b5cf6',
    strength: '#3b82f6',
    other: '#f59e0b'
  };

  const exercises = Object.keys(exerciseTypes).map((type) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    sessions: exerciseTypes[type],
    icon: exerciseIcons[type] || '🏋️',
    color: exerciseColors[type] || '#6b7280'
  }));

  return {
    exercises,
    goal: 20,
    weeklyGoal: 5
  };
};

// Diet data
const calculateDietData = async (userId, startDate, endDate) => {
  const activities = await UserActivity.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
    'diet.totalCalories': { $exists: true }
  });

  if (!activities.length) {
    return {
      calories: { consumed: 0, goal: 2000 },
      nutrition: [
        { label: 'Protein', value: 0, goal: 80, unit: 'g', color: '#3b82f6' },
        { label: 'Carbs', value: 0, goal: 200, unit: 'g', color: '#f59e0b' },
        { label: 'Fats', value: 0, goal: 60, unit: 'g', color: '#ec4899' }
      ],
      waterIntake: { current: 0, goal: 8 }
    };
  }

  let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFats = 0, totalWater = 0, count = 0;

  activities.forEach((activity) => {
    if (activity.diet) {
      totalCalories += activity.diet.totalCalories || 0;
      totalProtein += activity.diet.nutrition?.protein || 0;
      totalCarbs += activity.diet.nutrition?.carbs || 0;
      totalFats += activity.diet.nutrition?.fats || 0;
      totalWater += activity.diet.waterIntake || 0;
      count++;
    }
  });

  return {
    calories: {
      consumed: count ? Math.round(totalCalories / count) : 0,
      goal: 2000
    },
    nutrition: [
      { label: 'Protein', value: Math.round(totalProtein / count), goal: 80, unit: 'g', color: '#3b82f6' },
      { label: 'Carbs', value: Math.round(totalCarbs / count), goal: 200, unit: 'g', color: '#f59e0b' },
      { label: 'Fats', value: Math.round(totalFats / count), goal: 60, unit: 'g', color: '#ec4899' }
    ],
    waterIntake: { current: Math.round(totalWater / count), goal: 8 }
  };
};

// Generate insights
const generateInsights = (reportData) => {
  const insights = [];

  if (reportData.currentStreak >= 7)
    insights.push({
      icon: '🔥',
      text: `Amazing! You've maintained a ${reportData.currentStreak}-day streak. Keep it up!`,
      type: 'positive'
    });
  else if (reportData.currentStreak >= 3)
    insights.push({
      icon: '🎯',
      text: `You're on a ${reportData.currentStreak}-day streak! Just ${7 - reportData.currentStreak} more days to reach a week.`,
      type: 'info'
    });

  if (reportData.exerciseData?.exercises?.length) {
    const totalSessions = reportData.exerciseData.exercises.reduce((sum, ex) => sum + ex.sessions, 0);
    const goalPercentage = (totalSessions / (reportData.exerciseData.goal || 20)) * 100;

    if (goalPercentage >= 100)
      insights.push({
        icon: '💪',
        text: `You've reached your exercise goal this period!`,
        type: 'positive'
      });
  }

  if (reportData.journalCount < 5)
    insights.push({
      icon: '📝',
      text: `Try journaling more often to support your mental wellness.`,
      type: 'info'
    });

  if (reportData.dietData?.waterIntake?.current >= reportData.dietData?.waterIntake?.goal)
    insights.push({
      icon: '💧',
      text: `Great hydration! You're meeting your daily water goals.`,
      type: 'positive'
    });

  if (reportData.moodTrend > 10)
    insights.push({
      icon: '😊',
      text: `Your mood has improved by ${reportData.moodTrend}% recently.`,
      type: 'positive'
    });

  return insights;
};

// =========================
// CONTROLLERS
// =========================

export const getProgressReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeRange = '30' } = req.query;
    const { startDate, endDate } = getDateRange(timeRange);

    const streakData = await calculateStreak(userId, endDate);
    const moodData = await calculateMoodData(userId, startDate, endDate);
    const exerciseData = await calculateExerciseData(userId, startDate, endDate);
    const dietData = await calculateDietData(userId, startDate, endDate);

    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const activeDays = await UserActivity.countDocuments({
      userId,
      date: { $gte: startDate, $lte: endDate },
      streakDay: true
    });

    const goalProgress = Math.round((activeDays / totalDays) * 100);

    const reportData = {
      ...streakData,
      ...moodData,
      exerciseData,
      dietData,
      goalProgress,
      goalTrend: 5,
      streakTrend: 10
    };

    // 🚨 SANITIZE INSIGHTS to prevent CastError
    reportData.insights = (generateInsights(reportData) || []).map(item =>
      typeof item === 'string'
        ? { icon: 'ℹ️', text: item, type: 'info' }
        : {
            icon: item.icon || 'ℹ️',
            text: item.text || '',
            type: item.type || 'info'
          }
    );

    const progressReport = new ProgressReport({
      userId,
      startDate,
      endDate,
      ...reportData
    });

    await progressReport.save();

    res.status(200).json({
      success: true,
      message: 'Progress report generated',
      data: progressReport
    });
  } catch (error) {
    console.error('Error generating progress report:', error);
    res.status(500).json({
      message: 'Error generating progress report',
      error: error.message
    });
  }
};

export const exportReport = async (req, res) => {
  try {
    res.json({ message: 'Export functionality coming soon' });
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({
      message: 'Error exporting report',
      error: error.message
    });
  }
};

export const getMetricData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { metricType } = req.params;
    const { timeRange = '30' } = req.query;

    const { startDate, endDate } = getDateRange(timeRange);
    let data;

    switch (metricType) {
      case 'mood':
        data = await calculateMoodData(userId, startDate, endDate);
        break;
      case 'exercise':
        data = await calculateExerciseData(userId, startDate, endDate);
        break;
      case 'diet':
        data = await calculateDietData(userId, startDate, endDate);
        break;
      default:
        return res.status(400).json({ message: 'Invalid metric type' });
    }

    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${req.params.metricType} data:`, error);
    res.status(500).json({
      message: 'Error fetching metric data',
      error: error.message
    });
  }
};
