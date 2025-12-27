import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  bloating: { type: Number, min: 1, max: 10, required: true },
  energy: { type: Number, min: 1, max: 10, required: true },
  mood: { type: Number, min: 1, max: 10, required: true },
  bodyChanges: [String],
  createdAt: { type: Date, default: Date.now }
});

symptomSchema.index({ userId: 1, createdAt: 1 }, { unique: true });

const Symptom = mongoose.model("Symptom", symptomSchema);
export default Symptom;
