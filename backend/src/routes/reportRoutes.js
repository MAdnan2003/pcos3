import express from "express";
import {
  getReports,
  resolveReport,
  setReview,
  deleteReport,
} from "../controllers/reportController.js";

import Report from "../models/Report.js";

const router = express.Router();

// Get ALL reports
router.get("/", getReports);

// =============================
//     NEW REPORT STATS ROUTE
// =============================
router.get("/stats", async (req, res) => {
  try {
    const pending = await Report.countDocuments({ status: "pending" });
    const reviewing = await Report.countDocuments({ status: "reviewing" });

    // resolved THIS MONTH
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const resolved = await Report.countDocuments({
      status: "resolved",
      date: { $gte: firstDayOfMonth },
    });

    res.json({
      pending,
      reviewing,
      resolved,
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Failed to load report stats" });
  }
});

// Set a report to reviewing
router.put("/:id/review", setReview);

// Resolve a report
router.put("/:id/resolve", resolveReport);

// Delete report
router.delete("/:id", deleteReport);

export default router;
