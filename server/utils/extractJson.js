export const extractJSON = (text) => {
  if (!text) {
    throw new Error("Empty LLM response");
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in LLM response");
  }

  const jsonString = text.slice(firstBrace, lastBrace + 1);

  return jsonString;
};
