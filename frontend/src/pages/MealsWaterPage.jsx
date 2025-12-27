import React, { useEffect, useMemo, useRef, useState } from "react";
import { addMeal, deleteMeal, getMealsByDate } from "../api/mealsApi";
import {
  getWaterSettings,
  getWaterSummary,
  logWater,
  updateWaterSettings,
} from "../api/waterApi";

function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"];
const QUICK_WATER = [150, 250, 500];

export default function MealsWaterPage() {
  const [date, setDate] = useState(todayStr());

  // Meals form
  const [mealType, setMealType] = useState("Breakfast");
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  // Meals data
  const [meals, setMeals] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  // Water
  const [settings, setSettings] = useState(null);
  const [totalWaterMl, setTotalWaterMl] = useState(0);
  const [waterLogs, setWaterLogs] = useState([]);

  // messages
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // reminder timer
  const timerRef = useRef(null);

  const waterPct = useMemo(() => {
    if (!settings?.dailyGoalMl) return 0;
    return Math.min(100, Math.round((totalWaterMl / settings.dailyGoalMl) * 100));
  }, [totalWaterMl, settings]);

  const loadMeals = async (d) => {
    const { status, result } = await getMealsByDate(d);
    if (status === 200 && result.success) {
      setMeals(result.data.meals);
      setTotalCalories(result.data.totalCalories);
    } else {
      setErr(result.message || "Failed to load meals");
    }
  };

  const loadWater = async (d) => {
    const r = await getWaterSummary(d);
    if (r.status === 200 && r.result.success) {
      setWaterLogs(r.result.data.logs);
      setTotalWaterMl(r.result.data.totalMl);
    } else {
      setErr(r.result.message || "Failed to load water");
    }
  };

  const loadSettings = async () => {
    const s = await getWaterSettings();
    if (s.status === 200 && s.result.success) {
      setSettings(s.result.data);
    } else {
      setErr(s.result.message || "Failed to load settings");
    }
  };

  useEffect(() => {
    loadSettings();
    loadMeals(date);
    loadWater(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMsg("");
    setErr("");
    loadMeals(date);
    loadWater(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  
  // Reminder (simple: toast-like banner using window alert)
useEffect(() => {
  // clear existing timer
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  // stop if reminders are disabled
  if (!settings || !settings.remindersEnabled) return;

  // request notification permission once
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  const intervalMs =
    Number(settings.reminderIntervalMin || 60) * 60 * 1000;

  timerRef.current = setInterval(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("💧 Water Reminder", {
        body: "Drink some water now!",
      });
    }
  }, intervalMs);

  // cleanup on unmount or settings change
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
}, [settings]);


  const onAddMeal = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!name.trim() || calories === "") {
      setErr("Meal name and calories are required");
      return;
    }

    const payload = {
      date,
      mealType,
      name: name.trim(),
      calories: Number(calories),
      time,
      notes,
    };

    const { status, result } = await addMeal(payload);
    if (status === 201 && result.success) {
      setMsg("✅ Meal added");
      setName("");
      setCalories("");
      setTime("");
      setNotes("");
      await loadMeals(date);
    } else {
      setErr(result.message || "Failed to add meal");
    }
  };

  const onDeleteMeal = async (id) => {
    setMsg("");
    setErr("");
    const { status, result } = await deleteMeal(id);
    if (status === 200 && result.success) {
      setMsg("🗑️ Meal deleted");
      await loadMeals(date);
    } else {
      setErr(result.message || "Failed to delete");
    }
  };

  const onLogWater = async (ml) => {
    setMsg("");
    setErr("");

    const r = await logWater({ date, amountMl: ml });
    if (r.status === 201 && r.result.success) {
      setMsg("💧 Water logged");
      await loadWater(date);
    } else {
      setErr(r.result.message || "Failed to log water");
    }
  };

  const onSaveSettings = async () => {
    setMsg("");
    setErr("");

    const r = await updateWaterSettings(settings);
    if (r.status === 200 && r.result.success) {
      setMsg("✅ Water settings saved");
      setSettings(r.result.data);
    } else {
      setErr(r.result.message || "Failed to save settings");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Meals & Water Tracker
          </h1>
          <p className="text-gray-600 mt-1">
            Track meals, calories, water intake and keep healthy habits consistent.
          </p>
        </div>

        {/* messages */}
        {msg && <div className="p-3 rounded-lg bg-green-100 text-green-700">{msg}</div>}
        {err && <div className="p-3 rounded-lg bg-red-100 text-red-700">{err}</div>}

        {/* Date picker */}
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-pink-200/60 flex items-center justify-between">
          <div className="text-gray-800 font-medium">Select Date</div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 rounded-xl border border-pink-300 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Meals section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Add meal */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-200/60">
            <h2 className="text-xl font-semibold text-gray-800">Add Meal</h2>
            <p className="text-sm text-gray-500 mb-4">Save what you ate and the calories</p>

            <form onSubmit={onAddMeal} className="space-y-3">
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                {MEAL_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Meal name (e.g., Rice + Chicken)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              />

              <input
                type="number"
                placeholder="Calories (e.g., 450)"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                min="0"
              />

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              />

              <input
                type="text"
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              />

              <button className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition">
                Add Meal
              </button>
            </form>
          </div>

          {/* Meals list */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-200/60">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Meals for {date}</h2>
                <p className="text-sm text-gray-500">Your daily calorie total updates automatically</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Calories</div>
                <div className="text-2xl font-bold text-gray-900">{totalCalories} kcal</div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {meals.length === 0 ? (
                <div className="text-gray-500">No meals added for this date.</div>
              ) : (
                meals.map((m) => (
                  <div
                    key={m._id}
                    className="flex items-start justify-between p-4 rounded-xl border border-pink-100 bg-pink-50/40"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">
                        {m.mealType} • {m.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {m.time ? `🕒 ${m.time} • ` : ""}
                        {m.calories} kcal
                        {m.notes ? ` • ${m.notes}` : ""}
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteMeal(m._id)}
                      className="text-sm px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Water section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-200/60 space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Water Intake</h2>
            <p className="text-sm text-gray-500">
              Track how much water you drink + set reminders
            </p>
          </div>

          {!settings ? (
            <div className="text-gray-500">Loading water settings...</div>
          ) : (
            <>
              {/* Settings */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Daily Goal (ml)</label>
                  <input
                    type="number"
                    value={settings.dailyGoalMl}
                    onChange={(e) =>
                      setSettings({ ...settings, dailyGoalMl: Number(e.target.value) })
                    }
                    className="w-full mt-1 px-4 py-2 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                    min="500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Reminder Interval (minutes)</label>
                  <input
                    type="number"
                    value={settings.reminderIntervalMin}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        reminderIntervalMin: Number(e.target.value),
                      })
                    }
                    className="w-full mt-1 px-4 py-2 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                    min="15"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <input
                    type="checkbox"
                    checked={settings.remindersEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, remindersEnabled: e.target.checked })
                    }
                    className="w-5 h-5"
                  />
                  <span className="text-sm text-gray-700">Enable reminders</span>
                </div>
              </div>

              <button
                onClick={onSaveSettings}
                className="px-4 py-2 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
              >
                Save Water Settings
              </button>

              {/* Summary */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">Today</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalWaterMl} ml
                    <span className="text-sm font-medium text-gray-500">
                      {" "}
                      / {settings.dailyGoalMl} ml
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{waterPct}% of goal</div>
                </div>

                {/* Quick add */}
                <div className="flex gap-2">
                  {QUICK_WATER.map((ml) => (
                    <button
                      key={ml}
                      onClick={() => onLogWater(ml)}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                    >
                      +{ml}ml
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-blue-500 to-purple-600"
                  style={{ width: `${waterPct}%` }}
                />
              </div>

              {/* Logs */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Water Logs</h3>
                {waterLogs.length === 0 ? (
                  <div className="text-gray-500">No water logs for this date.</div>
                ) : (
                  <div className="space-y-2">
                    {waterLogs.map((l) => (
                      <div
                        key={l._id}
                        className="flex justify-between items-center p-3 rounded-xl border border-pink-100 bg-pink-50/30"
                      >
                        <span className="text-gray-800">+ {l.amountMl} ml</span>
                        <span className="text-sm text-gray-500">
                          {new Date(l.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        
      </div>
    </div>
  );
}
