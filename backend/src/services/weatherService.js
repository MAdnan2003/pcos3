import axios from "axios";

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseURL = "https://api.openweathermap.org/data/2.5";
  }

  /* =========================
     CURRENT WEATHER
  ========================= */
  async getCurrentWeather(lat, lon) {
    try {
      const response = await axios.get(`${this.baseURL}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: "metric"
        }
      });

      return {
        temperature: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        weatherCondition: response.data.weather[0].main,
        description: response.data.weather[0].description,
        windSpeed: response.data.wind.speed,
        city: response.data.name,
        country: response.data.sys.country
      };
    } catch (error) {
      console.error("Weather API Error:", error.response?.data || error.message);
      throw new Error("Failed to fetch weather data");
    }
  }

  /* =========================
     AIR QUALITY
  ========================= */
  async getAirQuality(lat, lon) {
    try {
      const response = await axios.get(`${this.baseURL}/air_pollution`, {
        params: {
          lat,
          lon,
          appid: this.apiKey
        }
      });

      const airData = response.data.list[0];

      return {
        aqi: airData.main.aqi,
        aqiCategory: this.getAQICategory(airData.main.aqi),
        pm25: airData.components.pm2_5,
        pm10: airData.components.pm10,
        o3: airData.components.o3,
        no2: airData.components.no2,
        so2: airData.components.so2,
        co: airData.components.co
      };
    } catch (error) {
      console.error("Air Quality API Error:", error.response?.data || error.message);
      throw new Error("Failed to fetch air quality data");
    }
  }

  /* =========================
     ✅ UV INDEX (FIXED)
  ========================= */
  async getUVIndex(lat, lon) {
    try {
      const response = await axios.get(`${this.baseURL}/uvi`, {
        params: {
          lat,
          lon,
          appid: this.apiKey
        }
      });
  
      return response.data.value || 0;
    } catch (error) {
      console.error("UV Index API Error:", error.message);
      return 0;
    }
  }

  /* =========================
     FORECAST
  ========================= */
  async getForecast(lat, lon) {
    try {
      const response = await axios.get(`${this.baseURL}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: "metric"
        }
      });

      return response.data.list.map(item => ({
        timestamp: new Date(item.dt * 1000),
        temperature: item.main.temp,
        humidity: item.main.humidity,
        weatherCondition: item.weather[0].main,
        description: item.weather[0].description
      }));
    } catch (error) {
      console.error("Forecast API Error:", error.response?.data || error.message);
      throw new Error("Failed to fetch forecast data");
    }
  }

  /* =========================
     HELPERS
  ========================= */
  getAQICategory(aqi) {
    if (aqi === 1) return "Good";
    if (aqi === 2) return "Moderate";
    if (aqi === 3) return "Unhealthy for Sensitive";
    if (aqi === 4) return "Unhealthy";
    if (aqi === 5) return "Very Unhealthy";
    return "Hazardous";
  }

  getPollutionLevel(aqi, pm25, pm10) {
    if (aqi >= 4 || pm25 > 55.4 || pm10 > 154) return "Very High";
    if (aqi >= 3 || pm25 > 35.4 || pm10 > 54) return "High";
    if (aqi >= 2 || pm25 > 12 || pm10 > 24) return "Medium";
    return "Low";
  }
}

export default new WeatherService();
