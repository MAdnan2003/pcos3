import React, { useState, useEffect } from 'react';
import { 
  Cloud, Droplets, Wind, Sun, AlertTriangle, 
  TrendingUp, Heart, Activity, RefreshCw, Calendar,
  ThermometerSun, Gauge, Eye, EyeOff, X
} from 'lucide-react';
import { environmentalAPI, alertAPI } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [envData, setEnvData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [envResponse, alertResponse] = await Promise.all([
        environmentalAPI.getCurrent(),
        alertAPI.getAlerts({ isRead: false })
      ]);
      
      setEnvData(envResponse.data.data);
      setAlerts(alertResponse.data.alerts);
      setLastUpdated(new Date());
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch data. Please check your location settings.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
  };

  const handleDismissAlert = async (alertId) => {
    try {
      await alertAPI.dismissAlert(alertId);
      setAlerts(alerts.filter(alert => alert._id !== alertId));
    } catch (err) {
      console.error('Error dismissing alert:', err);
    }
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      await alertAPI.markAsRead(alertId);
      setAlerts(alerts.map(alert => 
        alert._id === alertId ? { ...alert, isRead: true } : alert
      ));
    } catch (err) {
      console.error('Error marking alert as read:', err);
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 1) return 'bg-green-500';
    if (aqi <= 2) return 'bg-yellow-500';
    if (aqi <= 3) return 'bg-orange-500';
    if (aqi <= 4) return 'bg-red-500';
    return 'bg-purple-700';
  };

  const getAQITextColor = (aqi) => {
    if (aqi <= 1) return 'text-green-600';
    if (aqi <= 2) return 'text-yellow-600';
    if (aqi <= 3) return 'text-orange-600';
    if (aqi <= 4) return 'text-red-600';
    return 'text-purple-700';
  };

  const getRiskColor = (risk) => {
    const colors = {
      'Low': 'text-green-600 bg-green-50 border-green-200',
      'Moderate': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'High': 'text-orange-600 bg-orange-50 border-orange-200',
      'Severe': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[risk] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'info': 'bg-blue-50 border-blue-200',
      'warning': 'bg-yellow-50 border-yellow-200',
      'danger': 'bg-red-50 border-red-200',
      'critical': 'bg-purple-50 border-purple-200'
    };
    return colors[severity] || 'bg-gray-50 border-gray-200';
  };

  const getSeverityIcon = (severity) => {
    if (severity === 'danger' || severity === 'critical') {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
    return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading environmental data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Unable to Load Data</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button 
              onClick={handleRefresh}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Environmental Monitor
            </h1>
            <p className="text-gray-600 flex items-center space-x-2">
              <span>{envData?.location.city}, {envData?.location.country}</span>
              {lastUpdated && (
                <>
                  <span>•</span>
                  <span className="text-sm">Updated at {formatTime(lastUpdated)}</span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2 shadow-sm"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className={`p-4 rounded-xl border-l-4 shadow-sm ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{alert.title}</h3>
                      <p className="text-gray-700 mb-3">{alert.message}</p>
                      
                      {/* Alert Details */}
                      {alert.details && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                          {alert.details.currentAQI && (
                            <div className="bg-white bg-opacity-50 rounded px-2 py-1">
                              <span className="text-gray-600">AQI:</span>
                              <span className="font-semibold ml-1">{alert.details.currentAQI}</span>
                            </div>
                          )}
                          {alert.details.temperature && (
                            <div className="bg-white bg-opacity-50 rounded px-2 py-1">
                              <span className="text-gray-600">Temp:</span>
                              <span className="font-semibold ml-1">{alert.details.temperature.toFixed(1)}°C</span>
                            </div>
                          )}
                          {alert.details.humidity && (
                            <div className="bg-white bg-opacity-50 rounded px-2 py-1">
                              <span className="text-gray-600">Humidity:</span>
                              <span className="font-semibold ml-1">{alert.details.humidity}%</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Recommendations */}
                      {alert.recommendations && alert.recommendations.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold text-gray-800 mb-2">Recommended Actions:</p>
                          <ul className="space-y-1">
                            {alert.recommendations.slice(0, 3).map((rec, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-sm">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span className="text-gray-700">{rec.action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDismissAlert(alert._id)}
                    className="ml-4 p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {/* Air Quality Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Wind className="w-8 h-8 text-purple-600" />
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getAQIColor(envData?.airQuality.aqi)}`}>
                {envData?.airQuality.aqiCategory}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Air Quality</h3>
            <p className={`text-4xl font-bold mb-2 ${getAQITextColor(envData?.airQuality.aqi)}`}>
              {envData?.airQuality.aqi}
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>PM2.5: <span className="font-semibold">{envData?.airQuality.pm25.toFixed(1)} µg/m³</span></p>
              <p>PM10: <span className="font-semibold">{envData?.airQuality.pm10.toFixed(1)} µg/m³</span></p>
            </div>
          </div>

          {/* Temperature Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <ThermometerSun className="w-8 h-8 text-orange-600" />
              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {envData?.weather.weatherCondition}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Temperature</h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">
              {envData?.weather.temperature.toFixed(1)}°C
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Feels like: <span className="font-semibold">{envData?.weather.feelsLike.toFixed(1)}°C</span></p>
              <p className="text-gray-500 capitalize">{envData?.weather.description}</p>
            </div>
          </div>

          {/* Humidity Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Droplets className="w-8 h-8 text-blue-600" />
              <Gauge className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Humidity</h3>
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {envData?.weather.humidity}%
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Wind: <span className="font-semibold">{envData?.weather.windSpeed.toFixed(1)} m/s</span></p>
              <p>Pressure: <span className="font-semibold">{envData?.weather.pressure} hPa</span></p>
            </div>
          </div>

          {/* PCOS Risk Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(envData?.pcosImpact.riskLevel)}`}>
                {envData?.pcosImpact.riskLevel} Risk
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PCOS Impact</h3>
            <p className="text-sm text-gray-700 mb-2">
              <span className="text-2xl font-bold text-pink-600">
                {envData?.pcosImpact.affectedSymptoms.length || 0}
              </span>
              <span className="ml-2">symptoms may be affected</span>
            </p>
            <div className="text-sm text-gray-600">
              {envData?.pollution.overallLevel && (
                <p>Pollution: <span className="font-semibold">{envData.pollution.overallLevel}</span></p>
              )}
            </div>
          </div>
        </div>

        {/* Affected Symptoms Section */}
        {envData?.pcosImpact.affectedSymptoms.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-purple-600" />
              Potentially Affected Symptoms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {envData.pcosImpact.affectedSymptoms.map((symptom, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">{symptom.symptom}</p>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className={`px-2 py-0.5 rounded-full ${
                        symptom.severity === 'High' ? 'bg-red-100 text-red-700' :
                        symptom.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {symptom.severity}
                      </span>
                      <span className="text-purple-600 font-semibold">
                        {symptom.likelihood}% likelihood
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {envData?.pcosImpact.recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
              Personalized Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {envData.pcosImpact.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 hover:bg-green-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {idx + 1}
                    </div>
                  </div>
                  <p className="text-gray-700 flex-1">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pollution Sources */}
        {envData?.pollution.sources.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Cloud className="w-6 h-6 mr-2 text-gray-600" />
              Identified Pollution Sources
            </h3>
            <div className="flex flex-wrap gap-2">
              {envData.pollution.sources.map((source, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;