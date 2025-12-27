import { useEffect, useState } from "react";
import { Dumbbell, HeartPulse, Activity } from "lucide-react";
import { getWorkoutPlan } from "../api/workoutApi";

/* =========================
   UI META
========================= */
const SECTION_META = {
  yoga: {
    icon: HeartPulse,
    title: "Yoga & Flexibility",
    gradient: "from-pink-400 to-rose-500",
  },
  strength: {
    icon: Dumbbell,
    title: "Strength Training",
    gradient: "from-purple-500 to-indigo-600",
  },
  cardio: {
    icon: Activity,
    title: "Low-Impact Cardio",
    gradient: "from-sky-500 to-cyan-600",
  },
};

/* =========================
   NORMALIZE BACKEND DATA
========================= */
function normalizePlan(raw) {
  return {
    fitnessLevel: raw?.fitnessLevel || "beginner",
    yoga: Array.isArray(raw?.yoga) ? raw.yoga : [],
    strength: Array.isArray(raw?.strength) ? raw.strength : [],
    cardio: Array.isArray(raw?.cardio) ? raw.cardio : [],
    notes: Array.isArray(raw?.notes) ? raw.notes : [],
  };
}

export default function WorkoutPlan() {
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");

  /* =========================
     LOAD PLAN
  ========================= */
  useEffect(() => {
    (async () => {
      const { status, result } = await getWorkoutPlan();

      if (status !== 200 || !result?.data) {
        setError("Failed to load workout plan");
        return;
      }

      setPlan(normalizePlan(result.data));
    })();
  }, []);

  /* =========================
     STATES
  ========================= */
  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-red-100 text-red-700 p-4 rounded-lg text-center">
        {error}
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading your personalized workout plan…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">
          Your Personalized Workout Plan 💪
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Level:{" "}
          <span className="uppercase font-semibold">
            {plan.fitnessLevel}
          </span>
        </p>
      </div>

      {/* SECTIONS */}
      <div className="grid md:grid-cols-3 gap-6">
        {Object.keys(SECTION_META).map((type) => {
          const meta = SECTION_META[type];
          const Icon = meta.icon;
          const exercises = plan[type];

          return (
            <div
              key={type}
              className="bg-white rounded-2xl shadow border overflow-hidden"
            >
              {/* SECTION HEADER */}
              <div
                className={`bg-gradient-to-r ${meta.gradient} p-4 text-white flex items-center gap-3`}
              >
                <Icon size={22} />
                <h3 className="font-semibold text-lg">
                  {meta.title}
                </h3>
              </div>

              {/* EXERCISES */}
              <ul className="p-4 space-y-4 text-sm">
                {exercises.length === 0 && (
                  <li className="text-gray-400 italic">
                    No exercises available
                  </li>
                )}

                {exercises.map((exercise) => (
                  <li
                    key={exercise.id}
                    className="rounded-xl border p-3"
                  >
                    <div className="font-medium text-gray-800">
                      {exercise.label}
                    </div>

                    {exercise.reps && (
                      <div className="text-xs text-gray-500 mt-1">
                        {exercise.reps[plan.fitnessLevel]}
                      </div>
                    )}

                    {exercise.duration && (
                      <div className="text-xs text-gray-500 mt-1">
                        {exercise.duration[plan.fitnessLevel]}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* NOTES */}
      {plan.notes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h4 className="font-semibold text-blue-700 mb-2">
            🧠 Important Notes
          </h4>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
            {plan.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
