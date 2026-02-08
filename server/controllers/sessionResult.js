import Session from "../models/Session.js";
import Question from "../models/Questions.js";
import SessionResult from "../models/SessionResult.js";
import { generateResultWithGroq } from "../service/sessionResult.js";

/**
 * @route POST /api/result/generate/:sessionId
 */
export const generateSessionResult = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.user.toString() !== req.user) {
      return res.status(403).json({ message: "Access denied" });
    }

    const alreadyExists = await SessionResult.findOne({ session: sessionId });
    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "Result already generated" });
    }

    const questions = await Question.find({
      session: sessionId,
      score: { $ne: null },
    });

    if (questions.length === 0) {
      return res
        .status(400)
        .json({ message: "No evaluated questions found" });
    }

    // 🔥 GROQ CALL
    const aiResult = await generateResultWithGroq({
      session,
      questions,
    });

    const result = await SessionResult.create({
      user: req.user,
      session: sessionId,
      ...aiResult,
    });

    res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Result generation error:", error);
    res.status(500).json({ message: "Failed to generate result" });
  }
};

export const getSessionResult = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const result = await SessionResult.findOne({ session: sessionId });
    if (!result) {
      return res.status(404).json({ message: "Session result not found" });
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Error fetching session result:", error);
    res.status(500).json({ message: "Failed to fetch session result" });
  }
};