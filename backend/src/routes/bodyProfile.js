import express from "express";
import {
  createOrUpdateProfile,
  getProfile,
  analyzeBodyShape,
  getMeasurementHistory
} from "../controllers/bodyProfileController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createOrUpdateProfile);
router.get("/", auth, getProfile);

router.post("/analyze-shape", auth, analyzeBodyShape);
router.get("/history", auth, getMeasurementHistory);

export default router;