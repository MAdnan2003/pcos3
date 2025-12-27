import { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, Sun, Moon } from "lucide-react";

const SkincareRoutine = () => {
  const [skinType, setSkinType] = useState("");
  const [routine, setRoutine] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/skincare/routine", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setSkinType(res.data.data.skinType);
        setRoutine(res.data.data.routine || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-purple-600 font-semibold">
        ✨ Preparing your skincare routine...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles /> Personalized Skincare Routine
        </h2>
        <p className="mt-2 text-sm opacity-90">
          Tailored for PCOS-related acne & skin sensitivity
        </p>

        <span className="inline-block mt-3 px-3 py-1 bg-white/20 rounded-full text-sm">
          Skin Type: <b className="capitalize">{skinType}</b>
        </span>
      </div>

      {/* ROUTINE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* MORNING */}
        <div className="bg-white rounded-xl shadow p-5 border border-purple-100">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-600 mb-3">
            <Sun size={18} /> Morning Routine
          </h3>

          <ul className="space-y-2 text-sm text-gray-700">
            {routine.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-2 bg-purple-50 p-2 rounded"
              >
                <span className="text-purple-500 font-bold">•</span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* NIGHT */}
        <div className="bg-white rounded-xl shadow p-5 border border-pink-100">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-pink-600 mb-3">
            <Moon size={18} /> Night Routine
          </h3>

          <ul className="space-y-2 text-sm text-gray-700">
            {routine.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-2 bg-pink-50 p-2 rounded"
              >
                <span className="text-pink-500 font-bold">•</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* PCOS TIP */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-sm">
        <p className="font-semibold text-blue-700 mb-1">
          💡 PCOS Skincare Tip
        </p>
        <p className="text-blue-700">
          Hormonal acne responds best to gentle, consistent routines.
          Avoid over-exfoliating and always moisturize—even if your skin is oily.
        </p>
      </div>
    </div>
  );
};

export default SkincareRoutine;
