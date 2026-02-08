import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import Questions from "../models/Questions.js";
import { extractJSON } from "../utils/extractJson.js";
import Sessions from "../models/Session.js"; // Optional, if we need session context

// Initialize Groq client
// Ensure GROQ_API_KEY is in your .env file
const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "qwen/qwen3-32b",
    temperature: 0.7,
});

/**
 * @route   POST /api/ai/generate
 * @desc    Generate questions based on parameters
 * @access  Private
 */
export const generateQuestions = async (req, res) => {
    try {
        const { subject, topics, difficulty, examType, count } = req.body;

        if (!subject || !topics || !difficulty || !examType || !count) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const prompt = new PromptTemplate({
            template: `You are an expert exam setter for {examType}.
      Generate {count} {difficulty} level questions on the topic "{topics}" for the subject "{subject}".
      
      For each question, provide:
      1. The question text.
      2. A helpful hint (not the answer).
      3. The correct answer (for verification purposes).

      Return the response in a valid JSON format with the key "questions" which is an list of objects.
      Each object should have keys: "questionText", "hint", "correctAnswer".

      Ensure the output is strictly JSON and nothing else.
      `,
            inputVariables: ["subject", "topics", "difficulty", "examType", "count"],
        });

        // Create valid chain
        const chain = prompt.pipe(llm);

        const response = await chain.invoke({
            subject,
            topics,
            difficulty,
            examType,
            count: count.toString(),
        });

        const content = extractJSON(response.content);
        let parsedData;
        try {
            parsedData = JSON.parse(content);
        } catch (e) {
            // fallback or retry logic could go here
            return res.status(500).json({ message: "Failed to parse AI response", raw: content });
        }

        res.status(200).json({
            success: true,
            data: parsedData.questions || parsedData // Handle various JSON structures
        });

    } catch (error) {
        console.error("Generate Questions Error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * @route   POST /api/ai/verify
 * @desc    Verify user answer and provide feedback
 * @access  Private
 */
export const verifyAnswer = async (req, res) => {
    try {
        const { questionId, userAnswer } = req.body;

        if (!questionId || !userAnswer) {
            return res.status(400).json({ message: "Missing questionId or userAnswer" });
        }

        const question = await Questions.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Use LLM to evaluate
        // We don't strictly need the "correctAnswer" stored if the LLM can infer it, 
        // but having context helps. We'll pass the question and hint.

        const prompt = new PromptTemplate({
            template: `You are a strict but helpful tutor.
      Question: "{questionText}"
      User Answer: "{userAnswer}"
      Correct Answer (hidden from user): "{correctAnswer}"
      
      Evaluate the user's answer.
      1. Determine if it is correct (0-100 score). If the user's answer matches the Correct Answer meaning, give full points.
      2. Provide constructive feedback. If incorrect, explain why and give the correct solution based on the provided correct answer.
      
      Return JSON with keys: "score" (number), "feedback" (string).
      `,
            inputVariables: ["questionText", "userAnswer", "correctAnswer"],
        });

        const chain = prompt.pipe(llm);

        const response = await chain.invoke({
            questionText: question.questionText,
            userAnswer,
            correctAnswer: question.correctAnswer || "Not provided in database",
        });

        const evaluation = JSON.parse(extractJSON(response.content));

        // Update Question in DB
        question.userAnswer = userAnswer;
        question.aiFeedback = evaluation.feedback;
        question.score = evaluation.score;
        await question.save();

        res.status(200).json({
            success: true,
            score: evaluation.score,
            feedback: evaluation.feedback,
        });

    } catch (error) {
        console.error("Verify Answer Error:", error);
        res.status(500).json({ message: error.message });
    }
};
