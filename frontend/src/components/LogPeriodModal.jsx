import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../components/ui/button";
import { PCOS_SYMPTOMS, FLOW_OPTIONS } from "../types/cycle";
import { cn } from "../lib/utils";

export function LogPeriodModal({ isOpen, onClose, selectedDate, onSave }) {
  const [flow, setFlow] = useState("medium");
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const toggleSymptom = (id) => {
    setSymptoms((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave({ date: selectedDate, flow, symptoms, notes });
    onClose();
  };

  return (
    /* ✅ FULL SCREEN OVERLAY */
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Log Period
            </h2>
            <p className="text-sm text-gray-500">{selectedDate}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* FLOW */}
        <div className="mb-5">
          <p className="text-sm font-medium mb-2">Flow</p>
          <div className="grid grid-cols-4 gap-2">
            {FLOW_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFlow(opt.value)}
                className={cn(
                  "py-2 rounded-lg text-sm border transition",
                  flow === opt.value
                    ? "bg-pink-500 text-white border-pink-500"
                    : "border-gray-300 hover:bg-gray-100"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* SYMPTOMS */}
        <div className="mb-5">
          <p className="text-sm font-medium mb-2">Symptoms</p>
          <div className="flex flex-wrap gap-2">
            {PCOS_SYMPTOMS.map((symptom) => (
              <button
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm border transition",
                  symptoms.includes(symptom.id)
                    ? "bg-purple-600 text-white border-purple-600"
                    : "border-gray-300 hover:bg-gray-100"
                )}
              >
                {symptom.label}
              </button>
            ))}
          </div>
        </div>

        {/* NOTES */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-purple-400 outline-none"
            placeholder="Optional notes..."
          />
        </div>

        {/* ACTION */}
        <Button
          onClick={handleSave}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
