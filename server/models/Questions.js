import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    questionText: {
      type: String,
      required: true,
    },

    hint: {
      type: String,
      default: "", // AI-generated or predefined hint
    },

    correctAnswer: {
      type: String,
      required: true,
    },

    userAnswer: {
      type: String,
      default: "",
    },

    aiFeedback: {
      type: String,
      default: "",
    },

    score: {
      type: Number, // 0–100
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);