class PCOSImpactService {
  // Analyze environmental impact on PCOS symptoms
  analyzeImpact(weatherData, airQuality, userSymptoms) {
    const affectedSymptoms = [];
    const recommendations = [];
    let overallRisk = "Low";

    // Air Quality Impact
    if (airQuality.aqi >= 3) {
      // Poor air quality affects multiple symptoms
      if (userSymptoms.includes("acne")) {
        affectedSymptoms.push({
          symptom: "Acne Flare-up",
          severity: airQuality.aqi >= 4 ? "High" : "Moderate",
          likelihood: airQuality.aqi >= 4 ? 85 : 65
        });
        recommendations.push(
          "Use non-comedogenic skincare and cleanse face more frequently"
        );
      }

      if (userSymptoms.includes("fatigue")) {
        affectedSymptoms.push({
          symptom: "Increased Fatigue",
          severity: "Moderate",
          likelihood: 70
        });
        recommendations.push(
          "Limit outdoor activities and ensure indoor air quality"
        );
      }

      recommendations.push("Wear a mask outdoors (N95 or KN95 recommended)");
      recommendations.push("Use an air purifier indoors");
      overallRisk = airQuality.aqi >= 4 ? "High" : "Moderate";
    }

    // Temperature Impact
    if (weatherData.temperature > 32 || weatherData.temperature < 5) {
      if (userSymptoms.includes("mood-swings")) {
        affectedSymptoms.push({
          symptom: "Mood Fluctuations",
          severity: "Moderate",
          likelihood: 60
        });
        recommendations.push("Practice stress-reduction techniques");
      }

      if (weatherData.temperature > 32) {
        recommendations.push("Stay hydrated - drink at least 3L water today");
        recommendations.push(
          "Avoid outdoor activities during peak heat (11 AM - 4 PM)"
        );
      }

      if (overallRisk === "Low") overallRisk = "Moderate";
    }

    // Humidity Impact
    if (weatherData.humidity > 75) {
      if (userSymptoms.includes("acne")) {
        affectedSymptoms.push({
          symptom: "Skin Breakouts",
          severity: "Moderate",
          likelihood: 55
        });
        recommendations.push("Use oil-free, lightweight skincare products");
        recommendations.push("Blot excess oil throughout the day");
      }

      if (userSymptoms.includes("hair-fall")) {
        recommendations.push(
          "Avoid heavy hair products that can trap moisture"
        );
      }
    }

    // PM2.5 Specific Impact
    if (airQuality.pm25 > 35) {
      if (userSymptoms.includes("acne")) {
        recommendations.push(
          "Double cleanse at night to remove pollutant particles"
        );
      }
      recommendations.push("Take antioxidant-rich foods (berries, green tea)");
    }

    // Combined factors
    if (airQuality.aqi >= 4 && weatherData.temperature > 30) {
      affectedSymptoms.push({
        symptom: "Hormonal Stress Response",
        severity: "High",
        likelihood: 75
      });
      overallRisk = "Severe";
      recommendations.push(
        "Consider rescheduling non-essential outdoor activities"
      );
      recommendations.push("Prioritize indoor rest and recovery today");
    }

    // General PCOS recommendations for poor conditions
    if (overallRisk !== "Low") {
      recommendations.push(
        "Maintain your anti-inflammatory diet strictly today"
      );
      recommendations.push("Get adequate sleep (7-9 hours)");
      recommendations.push(
        "Practice gentle indoor exercise (yoga, stretching)"
      );
    }

    return {
      riskLevel: overallRisk,
      affectedSymptoms,
      recommendations: [...new Set(recommendations)] // Remove duplicates
    };
  }

  // Determine if alert should be triggered
  shouldTriggerAlert(weatherData, airQuality, userThresholds) {
    const triggers = [];

    if (airQuality.aqi >= (userThresholds.aqiLevel || 3)) {
      triggers.push({
        type: "air-quality",
        severity: airQuality.aqi >= 4 ? "danger" : "warning"
      });
    }

    if (
      weatherData.temperature >=
      (userThresholds.temperatureExtreme || 35)
    ) {
      triggers.push({
        type: "weather",
        severity: "warning"
      });
    }

    if (weatherData.humidity >= (userThresholds.humidityHigh || 80)) {
      triggers.push({
        type: "weather",
        severity: "info"
      });
    }

    return triggers;
  }

  // Get symptom-specific advice
  getSymptomAdvice(symptom, environmentalConditions) {
    const advice = {
      acne: {
        poor_air:
          "Cleanse skin thoroughly morning and night. Use antioxidant serums.",
        high_humidity:
          "Switch to oil-free products. Use blotting papers.",
        high_temp: "Avoid heavy makeup. Use SPF 30+ sunscreen."
      },
      fatigue: {
        poor_air:
          "Stay indoors when possible. Boost with B-vitamins and iron-rich foods.",
        high_humidity:
          "Stay in air-conditioned spaces. Avoid overexertion.",
        high_temp: "Rest frequently. Drink electrolyte water."
      },
      "hair-fall": {
        poor_air:
          "Cover hair outdoors. Wash more frequently to remove pollutants.",
        high_humidity:
          "Use anti-frizz products. Avoid tight hairstyles.",
        high_temp:
          "Protect hair from sun damage. Deep condition weekly."
      },
      "mood-swings": {
        poor_air: "Practice indoor relaxation. Limit caffeine.",
        high_humidity: "Use calming techniques. Stay cool.",
        high_temp: "Avoid stress. Practice breathing exercises."
      }
    };

    return advice[symptom] || {};
  }
}

export default new PCOSImpactService();
