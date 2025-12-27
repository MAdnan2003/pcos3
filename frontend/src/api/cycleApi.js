const BASE_URL = "/api/cycle";

const getToken = () => localStorage.getItem("token");

/* =========================
   GET USER LOGS
========================= */
export async function getCycleLogs() {
  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return res.json();
}

/* =========================
   CREATE / UPDATE LOG
========================= */
export async function saveCycleLog(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

/* =========================
   GET CYCLE STATS
========================= */
export async function getCycleStats() {
  const res = await fetch(`${BASE_URL}/stats`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return res.json();
}
