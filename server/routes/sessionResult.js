import express from "express";
import { generateSessionResult, getSessionResult } from "../controllers/sessionResult.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/generate", protect, generateSessionResult);
router.get("/get/:sessionId", protect, getSessionResult);

export default router;
