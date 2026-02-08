import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import SessionResult from "../models/SessionResult.js";

// Global In-Memory Cache
// Structure:
// {
//   [userId]: {
//     performance: { data: {}, lastFetched: number },
//     conversation: { history: [], lastInteraction: number }
//   }
// }
const userMemory = new Map();

const MEMORY_TTL = 30 * 60 * 1000; // 30 minutes for conversation
const PERFORMANCE_TTL = 60 * 60 * 1000; // 1 hour for performance data

const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.6,
});

/**
 * Fetches and strictly formats the user's latest performance data.
 */
const getLatestPerformance = async (userId) => {
    // Try to find the latest session result
    const latestResult = await SessionResult.findOne({ user: userId })
        .sort({ createdAt: -1 })
        .populate("session");

    if (!latestResult) {
        return "No exam data found. The student is new.";
    }

    return `
    Latest Exam: ${latestResult.session?.subject || "Unknown Subject"} (${latestResult.session?.examType || "General"
        })
    Score: ${latestResult.averageScore.toFixed(1)}%
    Level: ${latestResult.performanceLevel}
    Strengths: ${latestResult.strongTopics.join(", ") || "None listed"}
    Weaknesses: ${latestResult.weakTopics.join(", ") || "None listed"}
    Suggestion: ${latestResult.suggestions || "Keep practicing"}
  `.trim();
};

/**
 * Manages memory state (Performance + Conversation) and generates AI response.
 */
export const getCoachResponse = async (userId, userMessage) => {
    const now = Date.now();
    let userContext = userMemory.get(userId);

    // 1. Initialize Context if missing or expired conversation
    if (
        !userContext ||
        now - userContext.conversation.lastInteraction > MEMORY_TTL
    ) {
        userContext = {
            performance: { data: null, lastFetched: 0 },
            conversation: { history: [], lastInteraction: now },
        };
    }

    // 2. Refresh Performance Data if needed (Lazy Loading)
    if (
        !userContext.performance.data ||
        now - userContext.performance.lastFetched > PERFORMANCE_TTL
    ) {
        console.log(`🔄 Refreshing performance data for user ${userId}...`);
        const perfData = await getLatestPerformance(userId);
        userContext.performance = {
            data: perfData,
            lastFetched: now,
        };
    }

    // 3. Update Interaction Time
    userContext.conversation.lastInteraction = now;
    userMemory.set(userId, userContext); // Save back to map

    // 4. Construct Prompt
    const prompt = new PromptTemplate({
        template: `
    You are an expert, strict, and focused AI Academic Coach.
    Your SOLE purpose is to analyze student performance and provide detailed academic guidance.

    ### BOUNDARIES (CRITICAL)
    - If the user talks about ANYTHING unrelated to studies, exams, education, or their performance (e.g., sports, entertainment, casual chat, life advice), you must reply: "I am an AI Academic Coach designed strictly to assist with your academic performance. I cannot discuss other topics."
    - Do not entertain non-academic distractions.

    ### RESPONSE GUIDELINES
    1. *Be Comprehensive:* Provide detailed, substantial, and structured advice. Avoid short or superficial answers. Explain why and how to improve in depth.
    2. *Minimize Follow-ups:* Do NOT end your messages with questions unless absolutely necessary to clarify a vague request. Your goal is to provide a complete answer, not to keep a conversation going endlessly.
    3. *Data-Driven:* Always tie your advice back to their specific weak topics (from the context below) and previous exam history.
    4. *Tone:* Professional, authoritative yet encouraging, and highly focused on results.

    ### STUDENT PERFORMANCE CONTEXT (Refreshed Hourly)
    {performanceData}

    ### CONVERSATION HISTORY (Summarized)
    {chatHistory}

    ### CURRENT STUDENT MESSAGE
    "{userMessage}"

    AI Coach Response:
    `,
        inputVariables: ["performanceData", "chatHistory", "userMessage"],
    });

    // Prepare Chat History String
    const chatHistoryStr =
        userContext.conversation.history.length > 0
            ? userContext.conversation.history
                .map((msg) => `${msg.role}: ${msg.content}`)
                .join("\n")
            : "No previous messages.";

    // 5. Generate Response
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    const aiResponse = await chain.invoke({
        performanceData: userContext.performance.data,
        chatHistory: chatHistoryStr,
        userMessage: userMessage,
    });

    // 6. Update Conversation Memory (Simple Sliding Window / Summary)
    // Check if history is too long, if so, only keep last 6 exchanges
    const newHistory = [
        ...userContext.conversation.history,
        { role: "Student", content: userMessage },
        { role: "Coach", content: aiResponse },
    ];

    // Limit history to last 12 messages (6 turns) to keep context tight and cheap
    userContext.conversation.history = newHistory.slice(-12);
    userMemory.set(userId, userContext);

    return aiResponse;
};