const BASE = "http://localhost:5000/api/meals";

function getToken() {
  return localStorage.getItem("token");
}

export async function addMeal(data) {
  const token = getToken();
  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return { status: res.status, result: await res.json() };
}

export async function getMealsByDate(date) {
  const token = getToken();
  const res = await fetch(`${BASE}?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { status: res.status, result: await res.json() };
}

export async function deleteMeal(id) {
  const token = getToken();
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return { status: res.status, result: await res.json() };
}

