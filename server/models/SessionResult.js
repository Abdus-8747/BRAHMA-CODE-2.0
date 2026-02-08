import mongoose from "mongoose";

const sessionResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      unique: true, // one result per session
    },

    averageScore: {
      type: Number, // 0–100
      required: true,
    },

    performanceLevel: {
      type: String,
      enum: ["poor", "average", "good", "excellent"],
      required: true,
    },

    strongTopics: {
      type: [String],
      default: [],
    },

    weakTopics: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: String, // short actionable advice
      default: "",
    },

    nextTopicsToLearn: {
      type: [String], // roadmap for the user
      default: [],
    },

    detailedOverview: {
      type: String, // optional detailed analysis for each question
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SessionResult", sessionResultSchema);