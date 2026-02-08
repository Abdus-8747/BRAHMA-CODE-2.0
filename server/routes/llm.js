import express from "express";
import { generateQuestions, verifyAnswer } from "../controllers/llm.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/generate", protect, generateQuestions);
router.post("/verify", protect, verifyAnswer);

export default router;
