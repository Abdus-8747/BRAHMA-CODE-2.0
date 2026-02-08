import express from "express";
import {
  createSession,
  getMySessions,
  getSessionById,
  deleteSession,
} from "../controllers/sessions.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", protect, createSession);
router.get("/my", protect, getMySessions);
router.get("/:id", protect, getSessionById);
router.delete("/:id", protect, deleteSession);

export default router;
