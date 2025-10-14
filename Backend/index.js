import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Render!");
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
