import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ override: true });
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Route to generate AI insights
app.post("/api/generate-insights", async (req, res) => {
  try {
    const { data, filters = {} } = req.body;

    if (!data) {
      return res.status(400).json({ insight: "No chart data provided." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ insight: "GEMINI_API_KEY not set in .env" });
    }

    // ✨ Smart Gemini prompt for EV comparison analysis
    const prompt = `
      You are an expert EV market analyst. Analyze this comparison between ${filters.makes?.[0]} and ${filters.makes?.[1]}.
      
      Comparison Data:
      - ${data.make1}: ${data.make1Total} total vehicles (${filters.yearRange?.min}-${filters.yearRange?.max})
      - ${data.make2}: ${data.make2Total} total vehicles (${filters.yearRange?.min}-${filters.yearRange?.max})
      
      Year-by-year data: ${JSON.stringify(data.chartData?.slice(0, 5))}...

      Provide insights on:
      1. Which manufacturer is performing better in this period and why?
      2. Key trends in adoption for each brand
      3. Notable year-over-year growth or decline patterns
      4. Market positioning and competitive dynamics
      5. Strategic recommendations based on the data

      Keep the analysis professional, data-driven, and actionable (5-8 sentences).
    `;

    // Use the new Google Generative AI SDK
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insight = response.text();

    console.log("✅ Gemini AI insight generated successfully");
    res.json({ insight });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    res
      .status(500)
      .json({ insight: "Error generating insights. Check backend logs." });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
