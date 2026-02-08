import Session from "../models/Session.js";
import Question from "../models/Questions.js";

/**
 * @route   POST /session/create
 * @access  Private
 */
export const createSession = async (req, res) => {
  try {
    const { examType, subject, difficulty, topics } = req.body;

    if (!examType || !subject || !difficulty || !topics) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const session = await Session.create({
      user: req.user, // from auth middleware
      examType,
      subject,
      difficulty,
      topics,
    });
    

    return res.status(201).json({
      success: true,
      sessionId: session._id,
    });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @route   GET /session/my
 * @access  Private
 */
export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @route   GET /session/:id
 * @access  Private
 */
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("questions");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // security check
    if (session.user.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @route   DELETE /session/:id
 * @access  Private
 */
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.user.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Question.deleteMany({ session: session._id });
    await session.deleteOne();

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
