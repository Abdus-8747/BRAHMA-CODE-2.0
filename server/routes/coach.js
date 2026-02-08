import express from "express";
import { chatWithCoach } from "../controllers/coach.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/chat", protect, chatWithCoach);

export default router;