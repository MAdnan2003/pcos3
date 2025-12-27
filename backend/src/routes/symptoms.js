import express from "express";
import {
  saveSymptoms,
  getLatestSymptoms
} from "../controllers/symptomController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, saveSymptoms);
router.get("/latest", auth, getLatestSymptoms);

export default router;
