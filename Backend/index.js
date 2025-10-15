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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    // Create a comprehensive prompt based on the request type
    let prompt = "";
    
    if (filters.requestType === "comparison_insights" && data.make1 && data.make2) {
      // EV Adoption Comparison Analysis
      prompt = `You are an expert data analyst specializing in electric vehicle (EV) market trends.

**Analysis Request:** Compare EV adoption trends between ${data.make1} and ${data.make2}

**Data Summary:**
- Make 1: ${data.make1} (Total Vehicles: ${data.make1Total})
- Make 2: ${data.make2} (Total Vehicles: ${data.make2Total})
- Year Range: ${data.yearRange.min} - ${data.yearRange.max}
- Comparison Data Points: ${JSON.stringify(data.chartData)}

**Please provide:**
1. A clear comparison of adoption trends between these two makes
2. Which make has shown stronger growth and in which time periods
3. Key insights about market share differences
4. Notable patterns or inflection points in the data
5. Brief market context for these trends (2-3 sentences)

Keep the response concise (4-6 paragraphs), data-driven, and actionable. Use specific numbers from the data.`;

    } else if (filters.requestType === "comprehensive_insights") {
      // Dashboard-wide comprehensive analysis
      prompt = `You are an expert data analyst specializing in electric vehicle (EV) market trends.

**Analysis Request:** Provide comprehensive insights on the EV market dashboard data

**Data Summary:**
- Total Vehicles: ${data.totalVehicles || 'N/A'}
- Top Makes: ${JSON.stringify(data.topMakes || [])}
- EV Types Distribution: ${JSON.stringify(data.evTypes || [])}
- Top Counties: ${JSON.stringify(data.topCounties || [])}
- Recent Adoption Trend: ${JSON.stringify(data.adoptionTrend || [])}

**Please provide:**
1. Overview of the current EV market landscape
2. Key trends in EV adoption over time
3. Geographic concentration insights
4. Popular EV types and makes analysis
5. 2-3 actionable recommendations for stakeholders

Keep the response comprehensive yet concise (5-7 paragraphs), data-driven, and insightful. Use specific numbers from the data.`;

    } else {
      // Generic analysis for other chart types
      prompt = `You are an expert data analyst specializing in electric vehicle (EV) market trends.

**Analysis Request:** Analyze the following EV market data

**Data Summary:**
${JSON.stringify(data, null, 2)}

**Context:**
${filters.context || 'General EV Market Analysis'}

**Please provide:**
1. Key insights from the data
2. Notable trends or patterns
3. Comparative analysis where relevant
4. Brief actionable recommendations (2-3 sentences)

Keep the response concise (3-5 paragraphs), data-driven, and actionable.`;
    }

    const result = await model.generateContent(prompt);
    const insight = result.response.text();

    res.json({ insight });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    console.error("Error details:", error.message);
    res.status(500).json({ 
      insight: "Error generating insights. Please try again later.",
      error: error.message 
    });
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
