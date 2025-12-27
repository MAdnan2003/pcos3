import { useEffect, useState } from "react";
import { logWorkout, getWorkoutStats } from "../api/workoutProgressApi";
import { Flame, Dumbbell, Clock, Award } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const WorkoutProgress = () => {
  const [stats, setStats] = useState(null);
  const [type, setType] = useState("yoga");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    const { status, result } = await getWorkoutStats();
    if (status === 200 && result.success) {
      setStats(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const submit = async () => {
    if (!duration) return;

    await logWorkout({
      date: new Date().toISOString().split("T")[0],
      type,
      duration: Number(duration),
    });

    setDuration("");
    loadStats();
  };

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>No workout data yet</div>;

  /* =========================
     USE BACKEND LOG DATES
  ========================== */
  const workoutDates = (stats.logs || []).map(l => l.date);

  const workedDays = new Set(
    workoutDates.map(date => {
      const d = new Date(date);
      return (d.getDay() + 6) % 7; // Mon-first
    })
  );

  const computedStreak = stats.streak;

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-purple-600">
          Fitness Tracker
        </h1>
        <p className="text-sm text-gray-500">
          Track your exercise progress and celebrate your achievements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Workouts Days"
          value={stats.totalWorkouts}
          icon={<Dumbbell className="text-pink-500" />}
        />
        <StatCard
          title="Total Minutes"
          value={`${stats.totalMinutes} min`}
          icon={<Clock className="text-purple-500" />}
        />
        <StatCard
          title="Current Streak"
          value={`${computedStreak} days`}
          icon={<Flame className="text-orange-500" />}
        />
        <StatCard
          title="Badge"
          value={stats.badge}
          icon={<Award className="text-emerald-500" />}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-5 space-y-4">
        <h3 className="font-semibold text-purple-600">Log Workout</h3>

        <select
          className="w-full border rounded px-3 py-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="yoga">Yoga</option>
          <option value="strength">Strength Training</option>
          <option value="cardio">Low-impact Cardio</option>
        </select>

        <input
          type="number"
          placeholder="Duration (minutes)"
          className="w-full border rounded px-3 py-2"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded"
        >
          Log Workout
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold text-purple-600 mb-4">
          Weekly Progress
        </h3>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            const isWorked = workedDays.has(i);

            return (
              <div
                key={day}
                className={`h-12 rounded-lg flex items-center justify-center text-sm font-medium
                  ${isWorked
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "bg-gray-100 text-gray-400"
                  }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
    <div>
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
      {icon}
    </div>
  </div>
);

export default WorkoutProgress;
