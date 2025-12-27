import express from "express";
import auth from "../middleware/auth.js";

// =========================
// AUTH CONTROLLER (NAMED EXPORTS)
// =========================
import {
  register,
  login,
  getCurrentUser,
  updateProfile
} from "../controllers/authController.js";

// =========================
// OTHER CONTROLLERS (NAMESPACE IMPORTS)
// =========================
import * as environmentalController from "../controllers/environmentalController.js";
import * as alertController from "../controllers/alertController.js";

// ✅ ADD THIS
import medicalDetailsRoutes from "./medicalDetailsRoutes.js";

const router = express.Router();

/* =========================
   AUTH ROUTES
========================= */

// Register new user
router.post("/auth/register", register);

// Login user
router.post("/auth/login", login);

// Get current logged-in user
router.get("/auth/me", auth, getCurrentUser);

// Update profile
router.put("/auth/profile", auth, updateProfile);

/* =========================
   ENVIRONMENTAL ROUTES
========================= */

router.get(
  "/environmental/current",
  auth,
  environmentalController.getCurrentEnvironmentalData
);

router.get(
  "/environmental/historical",
  auth,
  environmentalController.getHistoricalData
);

router.get(
  "/environmental/forecast",
  auth,
  environmentalController.getForecast
);

router.get(
  "/environmental/analytics",
  auth,
  environmentalController.getAnalytics
);

/* =========================
   ALERT ROUTES
========================= */

router.get("/alerts", auth, alertController.getAlerts);

router.put(
  "/alerts/:alertId/read",
  auth,
  alertController.markAsRead
);

router.put(
  "/alerts/read-all",
  auth,
  alertController.markAllAsRead
);

router.delete(
  "/alerts/:alertId",
  auth,
  alertController.dismissAlert
);

router.get(
  "/alerts/stats",
  auth,
  alertController.getAlertStats
);

/* =========================
   MEDICAL DETAILS ROUTES
========================= */

// ✅ ADD THIS
router.use("/medical-details", medicalDetailsRoutes);

export default router;
