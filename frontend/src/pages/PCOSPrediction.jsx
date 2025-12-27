import { useState } from "react";
import axios from "axios";

const PCOSPrediction = () => {
  const [form, setForm] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setResult("");

      const res = await axios.post(
        "http://localhost:5000/api/pcos/predict-pcos",
        form
      );

      setResult(res.data.result || "Prediction completed");
    } catch (err) {
      setError("PCOS prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold text-purple-600">
        PCOS Risk Prediction
      </h2>

      <p className="text-sm text-gray-500">
        Enter your details to get an AI-based PCOS risk prediction
      </p>

      <div className="grid grid-cols-2 gap-3">
        {[
          ["age", "Age"],
          ["weight", "Weight (kg)"],
          ["height", "Height (cm)"],
          ["bmi", "BMI"],
          ["cycle", "Irregular Cycle (1/0)"],
          ["hairLoss", "Hair Loss (1/0)"],
          ["pimples", "Pimples (1/0)"],
          ["fastFood", "Fast Food (1/0)"],
          ["skinDarkening", "Skin Darkening (1/0)"],
        ].map(([name, label]) => (
          <input
            key={name}
            name={name}
            placeholder={label}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded hover:opacity-90 transition"
      >
        {loading ? "Predicting..." : "Predict PCOS"}
      </button>

      {result && (
        <div className="bg-green-50 text-green-700 p-3 rounded text-sm">
          <b>Result:</b> {result}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default PCOSPrediction;
