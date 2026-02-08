import express from "express";
import {
  addQuestionsToSession,
} from "../controllers/questions.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", protect, addQuestionsToSession);

export default router;
