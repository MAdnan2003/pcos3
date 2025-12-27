const BASE_URL = "http://localhost:5000/api/mood";

export async function getMoodByDate(date) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  return { status: res.status, result };
}

export async function saveMoodEntry(payload) {
  const token = localStorage.getItem("token");
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  return { status: res.status, result };
}
