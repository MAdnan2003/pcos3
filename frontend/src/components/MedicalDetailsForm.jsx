import React, { useEffect, useState } from "react";
import {
  createMedicalDetails,
  getMyMedicalDetails,
} from "../api/medicalDetailsApi";

const PCOS_TYPES = [
  "Insulin-Resistant PCOS",
  "Inflammatory PCOS",
  "Post-Pill PCOS",
  "Adrenal PCOS",
  "Unknown / Not diagnosed yet",
];

const SYMPTOMS_LIST = [
  "Irregular periods",
  "Acne",
  "Hair loss",
  "Weight gain",
  "Fatigue",
  "Mood changes",
  "Sugar cravings",
];

const EXERCISE_LEVELS = ["Sedentary", "Light", "Moderate", "Intense"];
const DIET_TYPES = [
  "Balanced",
  "Low-carb",
  "High-protein",
  "Vegetarian",
  "Vegan",
  "Other",
];
const STRESS_LEVELS = ["Low", "Medium", "High"];
const SMOKING_STATUS = ["Non-smoker", "Occasional", "Regular"];

function MedicalDetailsForm() {
  const [form, setForm] = useState({
    weight: "",
    height: "",
    pcosType: "",
    symptoms: [],
    exerciseLevel: "",
    dietType: "",
    stressLevel: "",
    smokingStatus: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMyMedicalDetails().then(({ status, result }) => {
      if (status === 200 && result?.data) {
        setForm(result.data);
      }
    });
  }, []);

  const toggleSymptom = (symptom) => {
    setForm((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { status, result } = await createMedicalDetails(form);

    if (status >= 200 && status < 300) {
      setMessage("✅ Medical details saved successfully");
    } else {
      setMessage(result?.message || "❌ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">
        Medical Details
      </h2>

      {message && (
        <div className="mb-4 p-3 rounded bg-blue-100 text-blue-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Weight */}
        <input
          type="number"
          placeholder="Weight (kg)"
          className="w-full border rounded px-3 py-2"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
        />

        {/* Height */}
        <input
          type="number"
          placeholder="Height (cm)"
          className="w-full border rounded px-3 py-2"
          value={form.height}
          onChange={(e) => setForm({ ...form, height: e.target.value })}
        />

        {/* PCOS Type */}
        <select
          className="w-full border rounded px-3 py-2"
          value={form.pcosType}
          onChange={(e) => setForm({ ...form, pcosType: e.target.value })}
        >
          <option value="">Select PCOS Type</option>
          {PCOS_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Symptoms */}
        <div>
          <p className="font-medium mb-2">Symptoms</p>
          <div className="grid grid-cols-2 gap-2">
            {SYMPTOMS_LIST.map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.symptoms.includes(s)}
                  onChange={() => toggleSymptom(s)}
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        {/* Exercise Level */}
        <select
          className="w-full border rounded px-3 py-2"
          value={form.exerciseLevel}
          onChange={(e) =>
            setForm({ ...form, exerciseLevel: e.target.value })
          }
        >
          <option value="">Exercise Level</option>
          {EXERCISE_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* Diet Type */}
        <select
          className="w-full border rounded px-3 py-2"
          value={form.dietType}
          onChange={(e) => setForm({ ...form, dietType: e.target.value })}
        >
          <option value="">Diet Type</option>
          {DIET_TYPES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Stress Level */}
        <select
          className="w-full border rounded px-3 py-2"
          value={form.stressLevel}
          onChange={(e) => setForm({ ...form, stressLevel: e.target.value })}
        >
          <option value="">Stress Level</option>
          {STRESS_LEVELS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Smoking Status */}
        <select
          className="w-full border rounded px-3 py-2"
          value={form.smokingStatus}
          onChange={(e) =>
            setForm({ ...form, smokingStatus: e.target.value })
          }
        >
          <option value="">Smoking Status</option>
          {SMOKING_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          {loading ? "Saving..." : "Save Medical Details"}
        </button>
      </form>
    </div>
  );
}

export default MedicalDetailsForm;
