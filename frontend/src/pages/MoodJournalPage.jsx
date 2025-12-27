import React, { useEffect, useState } from "react";
import { getMoodByDate, saveMoodEntry } from "../api/moodApi";

function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const MOODS = ["Happy", "Calm", "Neutral", "Sad", "Anxious", "Stressed", "Angry", "Tired"];

export default function MoodJournalPage() {
  const [date, setDate] = useState(todayStr());
  const [mood, setMood] = useState("");
  const [confidence, setConfidence] = useState(5);
  const [journal, setJournal] = useState("");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async (d) => {
    setMsg(""); setErr("");
    const { status, result } = await getMoodByDate(d);
    if (status === 200 && result.success) {
      const entry = result.data;
      if (entry) {
        setMood(entry.mood || "");
        setConfidence(entry.confidence || 5);
        setJournal(entry.journal || "");
      } else {
        setMood("");
        setConfidence(5);
        setJournal("");
      }
    } else {
      setErr(result.message || "Failed to load mood entry");
    }
  };

  useEffect(() => {
    load(date);
    // eslint-disable-next-line
  }, [date]);

  const onSave = async (e) => {
    e.preventDefault();
    setMsg(""); setErr("");

    if (!mood) {
      setErr("Please select a mood.");
      return;
    }

    setLoading(true);
    const { status, result } = await saveMoodEntry({ date, mood, confidence, journal });
    setLoading(false);

    if (status === 200 && result.success) {
      setMsg("✅ Mood entry saved");
    } else {
      setErr(result.message || "Failed to save");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mood & Journal
          </h1>
          <p className="text-gray-600 mt-1">
            Record your mood, confidence level, and a short journal entry.
          </p>
        </div>

        {msg && <div className="p-3 rounded-lg bg-green-100 text-green-700">{msg}</div>}
        {err && <div className="p-3 rounded-lg bg-red-100 text-red-700">{err}</div>}

        <div className="bg-white p-5 rounded-2xl shadow-lg border border-pink-200/60 flex items-center justify-between">
          <div className="text-gray-800 font-medium">Select Date</div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 rounded-xl border border-pink-300 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        <form onSubmit={onSave} className="bg-white p-6 rounded-2xl shadow-lg border border-pink-200/60 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Mood *</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="">Select mood</option>
              {MOODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Confidence Level: <span className="font-semibold">{confidence}</span>/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Journal (optional, max 500 chars)</label>
            <textarea
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              rows={5}
              maxLength={500}
              placeholder="Write a short reflection..."
              className="w-full mt-1 px-4 py-2 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <div className="text-xs text-gray-500 text-right">{journal.length}/500</div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
          >
            {loading ? "Saving..." : "Save Mood Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}
