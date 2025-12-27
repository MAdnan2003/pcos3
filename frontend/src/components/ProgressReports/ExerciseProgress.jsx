// frontend/src/components/ProgressReports/ExerciseProgress.jsx
import React from 'react';
import { Activity, Target } from 'lucide-react';
import styles from './ExerciseProgress.module.css';

const ExerciseProgress = ({ data }) => {
  const exercises = data?.exercises || [
    { name: 'Cardio', sessions: 8, color: '#10b981', icon: '🏃' },
    { name: 'Yoga', sessions: 12, color: '#8b5cf6', icon: '🧘' },
    { name: 'Strength', sessions: 4, color: '#3b82f6', icon: '💪' },
  ];

  const totalSessions = exercises.reduce((sum, ex) => sum + ex.sessions, 0);
  const goal = data?.goal || 20;
  const goalPercentage = ((totalSessions / goal) * 100).toFixed(0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Activity size={24} color="#10b981" />
          <h2 className={styles.title}>Exercise Progress</h2>
        </div>
        <div className={styles.goalBadge}>
          <Target size={16} />
          <span>{goalPercentage}% on track</span>
        </div>
      </div>

      <div className={styles.content}>
        {exercises.map((exercise, index) => (
          <div key={index} className={styles.exerciseItem}>
            <div className={styles.exerciseHeader}>
              <div className={styles.exerciseInfo}>
                <span className={styles.exerciseIcon}>{exercise.icon}</span>
                <span className={styles.exerciseName}>{exercise.name}</span>
              </div>
              <span className={styles.sessionCount}>
                {exercise.sessions} sessions
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ 
                  width: `${(exercise.sessions / goal) * 100}%`,
                  background: exercise.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.totalSessions}>
          <span className={styles.footerLabel}>Total Sessions</span>
          <span className={styles.footerValue}>{totalSessions} / {goal}</span>
        </div>
        <div className={styles.weeklyGoal}>
          <span className={styles.footerLabel}>Goal for this week</span>
          <span className={styles.footerValue}>{data?.weeklyGoal || 5} sessions</span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseProgress;