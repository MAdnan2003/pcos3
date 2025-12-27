// src/pages/DailyCheckIn.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, Circle, Calendar, Save } from 'lucide-react';

const DailyCheckIn = () => {
  const [checkInData, setCheckInData] = useState({
    date: new Date().toISOString().split('T')[0],
    tasks: {
      exerciseDone: false,
      exerciseType: 'cardio',
      exerciseDuration: 30,
      moodLogged: false,
      moodRating: 3,
      moodEmoji: '😐',
      journalWritten: false,
      breakfastEaten: false,
      lunchEaten: false,
      dinnerEaten: false,
      waterGoalMet: false,
      waterGlasses: 0,
      medicationTaken: false,
      symptomsTracked: false,
      periodTracked: false,
      skinCareRoutine: false,
      sleepQuality: 3,
      stressLevel: 3,
    },
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [todayCompleted, setTodayCompleted] = useState(false);

  useEffect(() => {
    loadTodayCheckIn();
  }, []);

  const loadTodayCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      const today = new Date().toISOString().split('T')[0];
      
      const response = await axios.get(
        `http://localhost:5000/api/daily-checkin/${today}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        setCheckInData(response.data);
        setTodayCompleted(true);
      }
    } catch (error) {
      console.log('No check-in for today');
    }
  };

  const handleTaskToggle = (taskName) => {
    setCheckInData({
      ...checkInData,
      tasks: {
        ...checkInData.tasks,
        [taskName]: !checkInData.tasks[taskName]
      }
    });
  };

  const handleMoodSelect = (rating, emoji) => {
    setCheckInData({
      ...checkInData,
      tasks: {
        ...checkInData.tasks,
        moodLogged: true,
        moodRating: rating,
        moodEmoji: emoji
      }
    });
  };

  const handleWaterIncrement = () => {
    const newCount = Math.min(checkInData.tasks.waterGlasses + 1, 8);
    setCheckInData({
      ...checkInData,
      tasks: {
        ...checkInData.tasks,
        waterGlasses: newCount,
        waterGoalMet: newCount >= 8
      }
    });
  };

  const handleWaterDecrement = () => {
    const newCount = Math.max(checkInData.tasks.waterGlasses - 1, 0);
    setCheckInData({
      ...checkInData,
      tasks: {
        ...checkInData.tasks,
        waterGlasses: newCount,
        waterGoalMet: newCount >= 8
      }
    });
  };

  const saveCheckIn = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/daily-checkin',
        checkInData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSaved(true);
      setTodayCompleted(true);
      
      setTimeout(() => setSaved(false), 3000);
      
      alert('✅ Daily check-in saved successfully!');
    } catch (error) {
      console.error('Error saving check-in:', error);
      alert('Failed to save check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = () => {
    const tasks = checkInData.tasks;
    const totalTasks = [
      tasks.exerciseDone,
      tasks.moodLogged,
      tasks.journalWritten,
      tasks.breakfastEaten,
      tasks.lunchEaten,
      tasks.dinnerEaten,
      tasks.waterGoalMet,
      tasks.medicationTaken,
      tasks.symptomsTracked,
      tasks.skinCareRoutine
    ];
    
    const completed = totalTasks.filter(Boolean).length;
    return Math.round((completed / totalTasks.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Daily Check-In</h1>
            <p className="flex items-center gap-2">
              <Calendar size={18} />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold">{completionPercentage}%</div>
            <div className="text-sm">Completed</div>
          </div>
        </div>
        
        <div className="mt-4 bg-white/30 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-white h-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">

        {/* Exercise Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-green-600 flex items-center gap-2">
            🏃‍♀️ Exercise & Activity
          </h2>
          
          <div className="space-y-3">
            <TaskCheckbox
              checked={checkInData.tasks.exerciseDone}
              onChange={() => handleTaskToggle('exerciseDone')}
              label="Completed workout today"
            />
            
            {checkInData.tasks.exerciseDone && (
              <div className="ml-8 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exercise Type
                  </label>
                  <select
                    value={checkInData.tasks.exerciseType}
                    onChange={(e) => setCheckInData({
                      ...checkInData,
                      tasks: { ...checkInData.tasks, exerciseType: e.target.value }
                    })}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="cardio">🏃 Cardio</option>
                    <option value="yoga">🧘 Yoga</option>
                    <option value="strength">💪 Strength Training</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration: {checkInData.tasks.exerciseDuration} minutes
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={checkInData.tasks.exerciseDuration}
                    onChange={(e) => setCheckInData({
                      ...checkInData,
                      tasks: { ...checkInData.tasks, exerciseDuration: parseInt(e.target.value) }
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mood & Wellness Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-purple-600 flex items-center gap-2">
            😊 Mood & Wellness
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How are you feeling today?
              </label>
              <div className="flex gap-4 justify-center">
                {[
                  { rating: 1, emoji: '😢', label: 'Sad' },
                  { rating: 2, emoji: '😕', label: 'Down' },
                  { rating: 3, emoji: '😐', label: 'Okay' },
                  { rating: 4, emoji: '🙂', label: 'Good' },
                  { rating: 5, emoji: '😊', label: 'Great' }
                ].map(({ rating, emoji, label }) => (
                  <button
                    key={rating}
                    onClick={() => handleMoodSelect(rating, emoji)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                      checkInData.tasks.moodRating === rating
                        ? 'bg-purple-100 scale-110 ring-2 ring-purple-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-4xl mb-1">{emoji}</span>
                    <span className="text-xs text-gray-600">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <TaskCheckbox
              checked={checkInData.tasks.journalWritten}
              onChange={() => handleTaskToggle('journalWritten')}
              label="Wrote in journal"
            />
          </div>
        </div>

        {/* Nutrition Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-orange-600 flex items-center gap-2">
            🍎 Nutrition
          </h2>
          
          <div className="space-y-3">
            <TaskCheckbox
              checked={checkInData.tasks.breakfastEaten}
              onChange={() => handleTaskToggle('breakfastEaten')}
              label="Ate breakfast"
            />
            <TaskCheckbox
              checked={checkInData.tasks.lunchEaten}
              onChange={() => handleTaskToggle('lunchEaten')}
              label="Ate lunch"
            />
            <TaskCheckbox
              checked={checkInData.tasks.dinnerEaten}
              onChange={() => handleTaskToggle('dinnerEaten')}
              label="Ate dinner"
            />
            
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Water Intake (Goal: 8 glasses)
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleWaterDecrement}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-600 w-10 h-10 rounded-full font-bold"
                >
                  -
                </button>
                <div className="flex-1 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {checkInData.tasks.waterGlasses} / 8
                  </div>
                  <div className="text-sm text-gray-500">glasses</div>
                  <div className="flex justify-center gap-1 mt-2">
                    {[...Array(8)].map((_, i) => (
                      <span key={i} className="text-2xl">
                        {i < checkInData.tasks.waterGlasses ? '💧' : '○'}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleWaterIncrement}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-600 w-10 h-10 rounded-full font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PCOS Management Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-pink-600 flex items-center gap-2">
            💊 PCOS Management
          </h2>
          
          <div className="space-y-3">
            <TaskCheckbox
              checked={checkInData.tasks.medicationTaken}
              onChange={() => handleTaskToggle('medicationTaken')}
              label="Took medication/supplements"
            />
            <TaskCheckbox
              checked={checkInData.tasks.symptomsTracked}
              onChange={() => handleTaskToggle('symptomsTracked')}
              label="Tracked symptoms"
            />
            <TaskCheckbox
              checked={checkInData.tasks.periodTracked}
              onChange={() => handleTaskToggle('periodTracked')}
              label="Updated cycle tracker"
            />
          </div>
        </div>

        {/* Self Care Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-indigo-600 flex items-center gap-2">
            ✨ Self Care
          </h2>
          
          <div className="space-y-3">
            <TaskCheckbox
              checked={checkInData.tasks.skinCareRoutine}
              onChange={() => handleTaskToggle('skinCareRoutine')}
              label="Completed skincare routine"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sleep Quality: {['😴', '😑', '😐', '🙂', '😊'][checkInData.tasks.sleepQuality - 1]}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={checkInData.tasks.sleepQuality}
                onChange={(e) => setCheckInData({
                  ...checkInData,
                  tasks: { ...checkInData.tasks, sleepQuality: parseInt(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-700">📝 Notes</h2>
          <textarea
            value={checkInData.notes}
            onChange={(e) => setCheckInData({ ...checkInData, notes: e.target.value })}
            placeholder="Any additional notes about your day..."
            className="w-full p-3 border rounded-lg resize-none"
            rows="4"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={saveCheckIn}
          disabled={loading || todayCompleted}
          className={`w-full py-4 rounded-lg font-semibold text-white text-lg flex items-center justify-center gap-3 transition-all ${
            todayCompleted
              ? 'bg-green-500'
              : loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg transform hover:-translate-y-1'
          }`}
        >
          {todayCompleted ? (
            <>
              <CheckCircle2 size={24} />
              Check-in Completed for Today!
            </>
          ) : loading ? (
            'Saving...'
          ) : (
            <>
              <Save size={24} />
              Save Daily Check-in
            </>
          )}
        </button>

        {saved && (
          <div className="text-center text-green-600 font-semibold animate-pulse">
            ✅ Saved successfully! Your progress has been recorded.
          </div>
        )}
      </div>
    </div>
  );
};

const TaskCheckbox = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        {checked ? (
          <CheckCircle2 size={24} className="text-green-600" />
        ) : (
          <Circle size={24} className="text-gray-300" />
        )}
      </div>
      <span className={`text-lg ${checked ? 'text-gray-900 line-through' : 'text-gray-700'}`}>
        {label}
      </span>
    </label>
  );
};

export default DailyCheckIn;