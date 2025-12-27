import { useEffect, useState } from "react";

/* =========================
   API HELPERS
========================= */
const API_BASE = "http://localhost:5000/api/cycles";

const getToken = () => localStorage.getItem("token");

/* =========================
   HOOK
========================= */
export function useCycleData() {
  const [periodLogs, setPeriodLogs] = useState([]);
  const [stats, setStats] = useState({
    averageLength: null,
    shortestCycle: null,
    longestCycle: null,
    variability: null,
    lastPeriod: null
  });

  /* =========================
     LOAD LOGS
  ========================= */
  const fetchLogs = async () => {
    try {
      const res = await fetch(API_BASE, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setPeriodLogs(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch cycle logs:", err);
    }
  };

  /* =========================
     LOAD STATS
  ========================= */
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch cycle stats:", err);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  /* =========================
     ADD / UPDATE LOG
  ========================= */
  const addPeriodLog = async (log) => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(log)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        fetchLogs();
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to save period log:", err);
    }
  };

  /* =========================
     DELETE LOG  ✅ ADDED
  ========================= */
  const deletePeriodLog = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      fetchLogs();
      fetchStats();
    } catch (err) {
      console.error("Failed to delete period log:", err);
    }
  };

  /* =========================
     PUBLIC API
  ========================= */
  return {
    periodLogs,
    addPeriodLog,
    deletePeriodLog,
    getStats: () => stats
  };
}
