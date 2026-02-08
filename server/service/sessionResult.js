import { ChatGroq } from "@langchain/groq";
import { extractJSON } from "../utils/extractJson.js";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "qwen/qwen3-32b",
  temperature: 0.2,
});

export const generateResultWithGroq = async ({ session, questions }) => {
  const prompt = `
You are an AI learning mentor.

Analyze the following student session and generate a RESULT.

SESSION DETAILS:
Subject: ${session.subject}
Difficulty: ${session.difficulty}
Topics: ${session.topics.join(", ")}

QUESTIONS & PERFORMANCE:
${questions
  .map(
    (q, i) => `
Q${i + 1}: ${q.questionText}
Score: ${q.score}
Feedback: ${q.aiFeedback}
`
  )
  .join("\n")}

TASK:
Generate a final learning result for the student.

RULES:
- Respond ONLY in valid JSON.
- No markdown, no explanation.
- Scores are 0–100.

JSON FORMAT (STRICT):

{
  "averageScore": number,
  "performanceLevel": "poor | average | good | excellent",
  "strongTopics": ["string"],
  "weakTopics": ["string"],
  "suggestions": "string",
  "nextTopicsToLearn": ["string"],
  "detailedOverview": "string"
}
`;

  const response = await llm.invoke(prompt);

  const text =
    typeof response.content === "string"
      ? response.content
      : response.content?.[0]?.text;

  return JSON.parse(extractJSON(text));
};
