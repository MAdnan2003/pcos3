// frontend/src/components/ProgressReports/MenstrualCycleProgress.jsx
import React from 'react';
import { Calendar } from 'lucide-react';
import styles from './MenstrualCycleProgress.module.css';

const MenstrualCycleProgress = ({ data }) => {
  const currentDay = data?.currentDay || 15;
  const cycleLength = data?.cycleLength || 28;
  const nextPeriod = data?.nextPeriod || 'Day 13';
  const percentage = ((currentDay / cycleLength) * 100).toFixed(0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <span className={styles.icon}>🩸</span>
          <h2 className={styles.title}>Menstrual Cycle</h2>
        </div>
        <div className={styles.dateInfo}>
          <Calendar size={16} />
          <span>{data?.dateRange || '26 Dec, 2025'}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.progressInfo}>
          <div className={styles.currentDay}>
            <span className={styles.label}>Next Period</span>
            <span className={styles.dayValue}>{nextPeriod}</span>
          </div>
        </div>

        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className={styles.progressLabels}>
            <span className={styles.progressLabel}>Day 1</span>
            <span className={styles.progressLabel}>Day {cycleLength}</span>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Avg Cycle</span>
            <span className={styles.statValue}>{data?.avgCycle || '28'} days</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Period Length</span>
            <span className={styles.statValue}>{data?.periodLength || '5-7'} days</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Regularity</span>
            <span className={styles.statValue}>{data?.regularity || '85'}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenstrualCycleProgress;