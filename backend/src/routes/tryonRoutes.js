import express from "express";
import { virtualTryOn } from "../controllers/tryonController.js";

const router = express.Router();

router.post("/", virtualTryOn);

export default router;
