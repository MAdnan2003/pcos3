const BASE_URL = "http://localhost:5000/api/workouts";

const getToken = () => localStorage.getItem("token");

export async function getWorkoutPlan() {
  const res = await fetch(`${BASE_URL}/plan`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return { status: res.status, result: await res.json() };
}

export async function saveWorkoutPlan(plan) {
  const res = await fetch(`${BASE_URL}/plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ plan })
  });
  return res.json();
}
