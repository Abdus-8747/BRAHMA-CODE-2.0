import Session from "../models/Session.js";
import Question from "../models/Questions.js";

/**
 * @route   POST /api/question/add
 * @access  Private
 * body: { sessionId, questions: [{ questionText, hint }] }
 */
export const addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // ownership check
    if (session.user.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        questionText: q.questionText,
        hint: q.hint || "",
        correctAnswer: q.correctAnswer, // Store the correct answer
      }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();

    res.status(201).json({
      success: true,
      questions: createdQuestions,
    });
  } catch (error) {
    console.error("Add questions error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
