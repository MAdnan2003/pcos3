// frontend/src/components/ProgressReports/MoodTrends.jsx
import React from 'react';
import { Smile, TrendingUp } from 'lucide-react';
import styles from './MoodTrends.module.css';

const MoodTrends = ({ data, journalCount }) => {
  const moodData = data?.weekly || [
    { week: 'Week 1', mood: 75, emoji: '😊' },
    { week: 'Week 2', mood: 60, emoji: '😐' },
    { week: 'Week 3', mood: 85, emoji: '😄' },
    { week: 'Week 4', mood: 70, emoji: '🙂' },
  ];

  const journals = journalCount || 12;
  const maxMood = 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Smile size={24} color="#f59e0b" />
          <h2 className={styles.title}>Mood Trends</h2>
        </div>
        <div className={styles.journalBadge}>
          <span className={styles.journalIcon}>📝</span>
          <span className={styles.journalText}>{journals} Journal Entries</span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          {moodData.map((item, index) => (
            <div key={index} className={styles.barWrapper}>
              <div className={styles.barContainer}>
                <div 
                  className={styles.bar}
                  style={{ height: `${(item.mood / maxMood) * 100}%` }}
                >
                  <span className={styles.emoji}>{item.emoji}</span>
                </div>
              </div>
              <span className={styles.barLabel}>{item.week}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.insight}>
          <TrendingUp size={16} color="#10b981" />
          <span>Your mood has improved by 12% this month</span>
        </div>
      </div>
    </div>
  );
};

export default MoodTrends;