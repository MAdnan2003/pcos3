import express from "express";
import {
  getRecommendations,
  saveRecommendation
} from "../controllers/fashionRecommendationController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/recommendations", auth, getRecommendations);
router.post("/save", auth, saveRecommendation);

export default router;
