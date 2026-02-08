import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/sessions.js";
import questionRoutes from "./routes/questions.js";
import llmRoutes from "./routes/llm.js";
import sessionResultRoutes from "./routes/sessionResult.js";
import coachRoutes from "./routes/coach.js";
import analyticsRoutrs from './routes/analytics.js'


const app = express();
console.log(process.env.GROQ_API_KEY ? "✅ GROQ API Key loaded" : "⚠️ GROQ API Key missing");
// --------------------
// Security Middleware
// --------------------
app.use(helmet());

// --------------------
// CORS (Hackathon + Production Friendly)
// --------------------
app.use(
  cors({
    origin: "http://localhost:3000", // allow all for hackathon/demo
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// --------------------
// Body Parser
// --------------------
app.use(express.json({ limit: "10kb" }));

// --------------------
// Rate Limiter (IMPORTANT)
// --------------------
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // per IP
  message: "Too many requests, please try again later",
});

const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 40, // stricter for AI calls
  message: "Too many AI requests, slow down",
});

app.use(globalLimiter);

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/ai", aiLimiter, llmRoutes); // 🔥 AI protected
app.use("/api/result", aiLimiter, sessionResultRoutes);
app.use("/api/coach", aiLimiter, coachRoutes )
app.use('/api/analytics', analyticsRoutrs)
// --------------------
// Health Check
// --------------------
app.get("/", (req, res) => {
  res.status(200).send("🚀 API is running");
});

// --------------------
// 404 Handler
// --------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --------------------
// Global Error Handler
// --------------------
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ message: "Something went wrong" });
});

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });
