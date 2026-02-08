import express from "express";
import { getScoreAnalytics } from "../controllers/analytics.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/scores",protect, getScoreAnalytics);

export default router;