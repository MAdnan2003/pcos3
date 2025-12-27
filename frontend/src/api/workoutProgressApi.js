const API_BASE = "http://localhost:5000/api/workout-progress";

const getToken = () => localStorage.getItem("token");

/* =========================
   GET WORKOUT STATS
========================= */
export const getWorkoutStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await res.json();
    return { status: res.status, result: data };
  } catch {
    return {
      status: 500,
      result: { message: "Failed to fetch workout stats" }
    };
  }
};

/* =========================
   LOG WORKOUT
========================= */
export const logWorkout = async (payload) => {
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    return { status: res.status, result: data };
  } catch {
    return {
      status: 500,
      result: { message: "Failed to log workout" }
    };
  }
};
