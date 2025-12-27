// backend/services/workoutPlanService.js

export function generateWorkoutPlan(medical) {
  // ----------------------------------------
  // FITNESS LEVEL (ONLY exerciseLevel)
  // ----------------------------------------
  let fitnessLevel = "beginner";

  if (medical.exerciseLevel === "Light" || medical.exerciseLevel === "Moderate") {
    fitnessLevel = "intermediate";
  }

  if (medical.exerciseLevel === "Intense") {
    fitnessLevel = "expert";
  }

  const plan = {
    fitnessLevel,
    yoga: [],
    strength: [],
    cardio: [],
    notes: []
  };

  // ----------------------------------------
  // 🧘 YOGA
  // ----------------------------------------
  if (medical.stressLevel === "High") {
    plan.yoga.push({
      id: "restorative_yoga",
      label: "Restorative Yoga",
      duration: {
        beginner: "15–20 mins",
        intermediate: "25 mins",
        expert: "30 mins"
      },
      alternatives: [
        { id: "breathing", label: "Breathing Exercises (Pranayama)" }
      ]
    });
  } else {
    plan.yoga.push({
      id: "hatha_yoga",
      label: "Hatha Yoga",
      duration: {
        beginner: "20 mins",
        intermediate: "30 mins",
        expert: "45 mins"
      },
      alternatives: [
        { id: "yin_yoga", label: "Yin Yoga (slower pace)" }
      ]
    });
  }

  // ----------------------------------------
  // 🏋️ STRENGTH
  // ----------------------------------------
  plan.strength.push({
    id: "squats",
    label: "Bodyweight Squats",
    reps: {
      beginner: "2 × 8",
      intermediate: "3 × 12",
      expert: "4 × 20"
    },
    alternatives: [
      { id: "wall_sit", label: "Wall Sit (easier)" },
      { id: "glute_bridge", label: "Glute Bridge (easier)" }
    ]
  });

  plan.strength.push({
    id: "pushups",
    label: "Push-Ups",
    reps: {
      beginner: "2 × 5 (knees)",
      intermediate: "3 × 10",
      expert: "4 × 20"
    },
    alternatives: [
      { id: "wall_pushups", label: "Wall Push-Ups" }
    ]
  });

  // ----------------------------------------
  // 🚶 CARDIO (LOW-IMPACT)
  // ----------------------------------------
  plan.cardio.push({
    id: "walking",
    label: "Brisk Walking",
    duration: {
      beginner: "20 mins",
      intermediate: "30 mins",
      expert: "45 mins"
    },
    alternatives: [
      { id: "cycling", label: "Cycling (low resistance)" },
      { id: "swimming", label: "Swimming" }
    ]
  });

  // ----------------------------------------
  // 🧠 PCOS NOTES
  // ----------------------------------------
  if (medical.pcosType === "Insulin-Resistant PCOS") {
    plan.notes.push(
      "Avoid frequent HIIT sessions",
      "Consistency is more important than intensity"
    );
  }

  if (medical.symptoms.includes("Fatigue")) {
    plan.notes.push("Schedule rest days and avoid overtraining");
  }

  return plan;
}
