// frontend/src/components/ProgressReports/DietTracking.jsx
import React from 'react';
import { Apple, Droplet } from 'lucide-react';
import styles from './DietTracking.module.css';

const DietTracking = ({ data }) => {
  const nutritionData = data?.nutrition || [
    { label: 'Protein', value: 65, goal: 80, unit: 'g', color: '#3b82f6' },
    { label: 'Carbs', value: 180, goal: 200, unit: 'g', color: '#f59e0b' },
    { label: 'Fats', value: 45, goal: 60, unit: 'g', color: '#ec4899' },
  ];

  const waterIntake = data?.waterIntake || { current: 6, goal: 8 };
  const calories = data?.calories || { consumed: 1650, goal: 2000 };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Apple size={24} color="#10b981" />
          <h2 className={styles.title}>Diet Tracking</h2>
        </div>
      </div>

      <div className={styles.content}>
        {/* Calorie Summary */}
        <div className={styles.calorieCard}>
          <div className={styles.calorieHeader}>
            <span className={styles.calorieLabel}>Daily Calories</span>
            <span className={styles.calorieValue}>
              {calories.consumed} / {calories.goal}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(calories.consumed / calories.goal) * 100}%` }}
            />
          </div>
        </div>

        {/* Nutrition Breakdown */}
        <div className={styles.nutritionGrid}>
          {nutritionData.map((item, index) => (
            <div key={index} className={styles.nutritionCard}>
              <div className={styles.nutritionHeader}>
                <span className={styles.nutritionLabel}>{item.label}</span>
                <span className={styles.nutritionValue}>
                  {item.value}{item.unit}
                </span>
              </div>
              <div className={styles.nutritionBar}>
                <div 
                  className={styles.nutritionFill}
                  style={{ 
                    width: `${(item.value / item.goal) * 100}%`,
                    background: item.color
                  }}
                />
              </div>
              <span className={styles.nutritionGoal}>Goal: {item.goal}{item.unit}</span>
            </div>
          ))}
        </div>

        {/* Water Intake */}
        <div className={styles.waterCard}>
          <div className={styles.waterHeader}>
            <div className={styles.waterTitle}>
              <Droplet size={20} color="#3b82f6" />
              <span>Water Intake</span>
            </div>
            <span className={styles.waterValue}>
              {waterIntake.current} / {waterIntake.goal} glasses
            </span>
          </div>
          <div className={styles.waterGlasses}>
            {[...Array(waterIntake.goal)].map((_, index) => (
              <div 
                key={index}
                className={`${styles.glass} ${index < waterIntake.current ? styles.glassFilled : ''}`}
              >
                💧
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietTracking;