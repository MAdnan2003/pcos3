import EnvironmentalData from "../models/EnvironmentalData.js";
import User from "../models/User.js";
import Alert from "../models/Alert.js";
import weatherService from "../services/weatherService.js";
import pcosImpactService from "../services/pcosImpactService.js";

/* =========================
   GET CURRENT ENVIRONMENTAL DATA
========================= */
export const getCurrentEnvironmentalData = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (
      !user ||
      !user.location ||
      !user.location.latitude ||
      !user.location.longitude
    ) {
      return res.status(400).json({
        message:
          "User location not set. Please update your profile with location."
      });
    }

    const { latitude, longitude } = user.location;

    const [weather, airQuality, uvIndex] = await Promise.all([
      weatherService.getCurrentWeather(latitude, longitude),
      weatherService.getAirQuality(latitude, longitude),
      weatherService.getUVIndex(latitude, longitude)
    ]);

    const pcosImpact = pcosImpactService.analyzeImpact(
      weather,
      airQuality,
      user.profile?.symptoms || []
    );

    const pollution = {
      overallLevel: weatherService.getPollutionLevel(
        airQuality.aqi,
        airQuality.pm25,
        airQuality.pm10
      ),
      sources: identifyPollutionSources(airQuality)
    };

    const environmentalData = new EnvironmentalData({
      userId: user._id,
      location: {
        city: weather.city,
        country: weather.country,
        latitude,
        longitude
      },
      weather: {
        ...weather,
        uvIndex
      },
      airQuality,
      pollution,
      pcosImpact
    });

    await environmentalData.save();

    await checkAndCreateAlerts(user, weather, airQuality, pcosImpact);

    res.json({
      message: "Environmental data retrieved successfully",
      data: environmentalData
    });
  } catch (error) {
    console.error("Get Environmental Data Error:", error);
    res.status(500).json({
      message: "Failed to fetch environmental data",
      error: error.message
    });
  }
};

/* =========================
   GET HISTORICAL DATA
========================= */
export const getHistoricalData = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const historicalData = await EnvironmentalData.find({
      userId: req.userId,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: -1 });

    res.json({
      message: "Historical data retrieved successfully",
      data: historicalData,
      count: historicalData.length
    });
  } catch (error) {
    console.error("Get Historical Data Error:", error);
    res.status(500).json({
      message: "Failed to fetch historical data",
      error: error.message
    });
  }
};

/* =========================
   GET FORECAST
========================= */
export const getForecast = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user?.location?.latitude || !user?.location?.longitude) {
      return res.status(400).json({ message: "User location not set" });
    }

    const forecast = await weatherService.getForecast(
      user.location.latitude,
      user.location.longitude
    );

    res.json({
      message: "Forecast retrieved successfully",
      data: forecast
    });
  } catch (error) {
    console.error("Get Forecast Error:", error);
    res.status(500).json({
      message: "Failed to fetch forecast",
      error: error.message
    });
  }
};

/* =========================
   GET ANALYTICS
========================= */
export const getAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const data = await EnvironmentalData.find({
      userId: req.userId,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: 1 });

    const avgAQI =
      data.reduce((sum, d) => sum + d.airQuality.aqi, 0) / (data.length || 1);
    const avgTemp =
      data.reduce((sum, d) => sum + d.weather.temperature, 0) /
      (data.length || 1);
    const avgHumidity =
      data.reduce((sum, d) => sum + d.weather.humidity, 0) /
      (data.length || 1);

    const highRiskDays = data.filter(
      d =>
        d.pcosImpact.riskLevel === "High" ||
        d.pcosImpact.riskLevel === "Severe"
    ).length;

    const symptomCounts = {};
    data.forEach(d => {
      d.pcosImpact.affectedSymptoms.forEach(s => {
        symptomCounts[s.symptom] =
          (symptomCounts[s.symptom] || 0) + 1;
      });
    });

    res.json({
      message: "Analytics retrieved successfully",
      summary: {
        averageAQI: Math.round(avgAQI * 10) / 10,
        averageTemperature: Math.round(avgTemp * 10) / 10,
        averageHumidity: Math.round(avgHumidity * 10) / 10,
        highRiskDays,
        totalDaysTracked: data.length
      },
      mostAffectedSymptoms: Object.entries(symptomCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([symptom, count]) => ({ symptom, count })),
      dailyData: data
    });
  } catch (error) {
    console.error("Get Analytics Error:", error);
    res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message
    });
  }
};

/* =========================
   ALERT CREATION
========================= */
export const checkAndCreateAlerts = async (
  user,
  weather,
  airQuality,
  pcosImpact
) => {
  try {
    const triggers = pcosImpactService.shouldTriggerAlert(
      weather,
      airQuality,
      user.preferences.alertThresholds
    );

    if (!triggers.length) return;

    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

    const existingAlert = await Alert.findOne({
      userId: user._id,
      isActive: true,
      triggeredAt: { $gte: sixHoursAgo }
    });

    if (existingAlert) return;

    const alert = new Alert({
      userId: user._id,
      type: triggers.length > 1 ? "combined" : triggers[0].type,
      severity: triggers.some(t => t.severity === "danger")
        ? "danger"
        : "warning",
      title: generateAlertTitle(triggers, airQuality, weather),
      message: generateAlertMessage(triggers, airQuality, weather, pcosImpact),
      details: {
        pollutants: identifyPollutionSources(airQuality),
        affectedSymptoms: pcosImpact.affectedSymptoms.map(s => s.symptom)
      },
      recommendations: pcosImpact.recommendations.map(r => ({ action: r }))
    });

    await alert.save();
  } catch (error) {
    console.error("Create Alert Error:", error);
  }
};

/* =========================
   HELPERS
========================= */
export const identifyPollutionSources = airQuality => {
  const sources = [];
  if (airQuality.pm25 > 35) sources.push("Particulate Matter");
  if (airQuality.no2 > 100) sources.push("Vehicle Emissions");
  if (airQuality.so2 > 100) sources.push("Industrial Activity");
  if (airQuality.o3 > 120) sources.push("Ground-level Ozone");
  if (airQuality.co > 10000) sources.push("Combustion Sources");
  return sources;
};

export const generateAlertTitle = triggers => {
  if (triggers.some(t => t.severity === "danger"))
    return "🚨 Critical Environmental Alert";
  return "⚠️ Environmental Alert";
};

export const generateAlertMessage = (triggers, airQuality, weather, impact) =>
  `Environmental conditions may worsen symptoms: ${impact.affectedSymptoms
    .map(s => s.symptom)
    .join(", ")}`;
