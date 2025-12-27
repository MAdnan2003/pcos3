// frontend/src/pages/ProgressReports/ProgressReports.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Activity } from 'lucide-react';
import styles from './ProgressReports.module.css';
import StatCard from '../../components/ProgressReports/StatCard';
import MenstrualCycleProgress from '../../components/ProgressReports/MenstrualCycleProgress';
import MoodTrends from '../../components/ProgressReports/MoodTrends';
import ExerciseProgress from '../../components/ProgressReports/ExerciseProgress';
import DietTracking from '../../components/ProgressReports/DietTracking';
import { getProgressReports, exportReport } from '../../services/progressReportsService';

const ProgressReports = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProgressReports(timeRange);
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to load progress reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      await exportReport(timeRange);
      alert('Report exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
        <button onClick={fetchReportData} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Progress Reports</h1>
          <div className={styles.timeRangeSelector}>
            <Calendar size={18} />
            <span className={styles.label}>Last</span>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className={styles.select}
            >
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
              <option value="365">1 Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Current Streak"
          value={`${reportData?.currentStreak || 0} Days`}
          subtitle="Keep it up!"
          color="purple"
          icon="🔥"
          trend={reportData?.streakTrend}
        />
        <StatCard
          title="Longest Streak"
          value={`${reportData?.longestStreak || 0} Days`}
          subtitle="Personal best"
          color="blue"
          icon="🏆"
        />
        <StatCard
          title="Mood"
          value={reportData?.averageMood || '😊'}
          subtitle="Average this month"
          color="orange"
          icon="😊"
          trend={reportData?.moodTrend}
        />
        <StatCard
          title="Goal Progress"
          value={`${reportData?.goalProgress || 0}%`}
          subtitle="Overall completion"
          color="green"
          icon="🎯"
          trend={reportData?.goalTrend}
        />
      </div>

      {/* Menstrual Cycle Progress */}
      <MenstrualCycleProgress data={reportData?.menstrualData} />

      {/* Mood Trends */}
      <MoodTrends data={reportData?.moodData} journalCount={reportData?.journalCount} />

      {/* Exercise Progress */}
      <ExerciseProgress data={reportData?.exerciseData} />

      {/* Diet Tracking */}
      <DietTracking data={reportData?.dietData} />

      {/* Key Insights */}
      <div className={styles.insightsSection}>
        <h2 className={styles.sectionTitle}>
          <TrendingUp size={20} />
          Key Insights
        </h2>
        <div className={styles.insightsList}>
          {reportData?.insights?.length > 0 ? (
            reportData.insights.map((insight, index) => (
              <div key={index} className={styles.insightItem}>
                <span className={styles.insightIcon}>{insight.icon}</span>
                <p className={styles.insightText}>{insight.text}</p>
              </div>
            ))
          ) : (
            <div className={styles.noInsights}>
              <p>Keep tracking your progress to get personalized insights!</p>
            </div>
          )}
        </div>
      </div>

      {/* Export Button */}
      <button 
        className={styles.exportButton}
        onClick={handleExportReport}
      >
        <Activity size={18} />
        Export Report
      </button>
    </div>
  );
};

export default ProgressReports;