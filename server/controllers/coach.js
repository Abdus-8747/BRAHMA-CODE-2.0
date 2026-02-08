import { getCoachResponse } from "../service/coach.js";

/**
 * @route   POST /api/coach/chat
 * @desc    Chat with the AI Performance Coach
 * @access  Private
 */
export const chatWithCoach = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // req.user comes from the auth middleware (it's the userId string)
        const reply = await getCoachResponse(req.user, message);

        res.status(200).json({
            success: true,
            reply,
        });
    } catch (error) {
        console.error("Coach Chat Error:", error);
        res.status(500).json({ message: "AI Coach is currently unavailable." });
    }
};