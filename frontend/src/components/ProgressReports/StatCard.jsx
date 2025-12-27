// frontend/src/components/ProgressReports/StatCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, subtitle, color = 'purple', icon, trend }) => {
  const colorClasses = {
    purple: styles.purple,
    blue: styles.blue,
    orange: styles.orange,
    green: styles.green,
  };

  return (
    <div className={`${styles.card} ${colorClasses[color]}`}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.title}>{title}</span>
      </div>
      
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        <div className={styles.footer}>
          <span className={styles.subtitle}>{subtitle}</span>
          {trend && trend !== 0 && (
            <div className={`${styles.trend} ${trend > 0 ? styles.trendUp : styles.trendDown}`}>
              {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;