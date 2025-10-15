import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from Frontend build
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "✅ Backend is running successfully!" });
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/generate-insights", async (req, res) => {
  try {
    const { data, filters = {} } = req.body;

    if (!data) return res.status(400).json({ insight: "No chart data provided." });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Analyze this data...`;
    const result = await model.generateContent(prompt);
    const insight = result.response.text();

    res.json({ insight });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    res.status(500).json({ insight: "Error generating insights." });
  }
});

// Catch-all route to serve React app for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});
