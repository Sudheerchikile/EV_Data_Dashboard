import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Insights.css";

const EVAdoptionChartWithAI = () => {
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);

  // Load JSON data
  useEffect(() => {
    fetch("/csvjson.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // Aggregate data by year
  const yearCountMap = {};
  data.forEach((ev) => {
    const year = ev["Model Year"];
    if (year) {
      yearCountMap[year] = (yearCountMap[year] || 0) + 1;
    }
  });

  const yearData = Object.entries(yearCountMap)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => Number(a.year) - Number(b.year));

  // Generate AI insights (client-side analysis)
  const handleGenerateInsights = async () => {
    setLoading(true);
    setInsights("");

    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Analyze the data
      const totalVehicles = yearData.reduce((sum, item) => sum + item.count, 0);
      const years = yearData.map(d => d.year);
      const counts = yearData.map(d => d.count);
      
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      const maxCount = Math.max(...counts);
      const minCount = Math.min(...counts);
      
      const peakYear = yearData.find(d => d.count === maxCount)?.year;
      const lowestYear = yearData.find(d => d.count === minCount)?.year;
      
      // Calculate growth rate
      const firstYearCount = yearData[0]?.count || 1;
      const lastYearCount = yearData[yearData.length - 1]?.count || 1;
      const growthRate = ((lastYearCount - firstYearCount) / firstYearCount * 100).toFixed(1);
      
      // Calculate year-over-year growth
      let positiveGrowthYears = 0;
      for (let i = 1; i < yearData.length; i++) {
        if (yearData[i].count > yearData[i - 1].count) {
          positiveGrowthYears++;
        }
      }
      const consistencyRate = ((positiveGrowthYears / (yearData.length - 1)) * 100).toFixed(0);

      // Generate insight object with structured data
      const insightData = {
        period: `${minYear} - ${maxYear}`,
        keyFindings: [
          `Total EV registrations: ${totalVehicles.toLocaleString()} vehicles`,
          `Peak adoption year: ${peakYear} with ${maxCount.toLocaleString()} registrations`,
          `Lowest adoption: ${lowestYear} with ${minCount.toLocaleString()} registrations`,
          `Overall growth rate: ${growthRate}% from ${minYear} to ${maxYear}`,
          `Market consistency: ${consistencyRate}% of years showed positive growth`
        ],
        trendAnalysis: 
          (growthRate > 0 
            ? `The EV market has shown ${growthRate > 100 ? 'exponential' : 'strong'} growth over this period. ` 
            : 'The market has experienced challenges with declining registrations. ') +
          (consistencyRate > 70 
            ? 'The growth has been remarkably consistent, indicating sustained market confidence.' 
            : 'Growth has been volatile, suggesting market fluctuations or regulatory changes.'),
        marketInsights: 
          peakYear >= maxYear - 2 
            ? '🚀 Recent peak suggests accelerating adoption and strong market momentum.' 
            : '⚠️ Peak occurred in earlier years, indicating possible market maturation or policy shifts.',
        recommendation: 
          growthRate > 50 && consistencyRate > 70
            ? '✅ Strong market fundamentals suggest continued investment opportunities in EV infrastructure.'
            : '📈 Market shows potential but may benefit from supportive policies and infrastructure development.'
      };

      setInsights(insightData);
    } catch (error) {
      console.error("Insight generation failed:", error);
      setInsights({
        error: "Failed to generate insights. Please try again."
      });
    }

    setLoading(false);
  };

  return (
    <div className="chart-container">
      <h2>📈 EV Adoption Over Time (by Model Year)</h2>

      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={yearData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            label={{
              value: "Vehicles Count",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#0077b5"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <button
        className="generate-btn"
        onClick={handleGenerateInsights}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "⚡ Generate AI Insights"}
      </button>

      {insights && !insights.error && (
        <div className="insight-box">
          <h3>🔍 AI Insights</h3>
          
          <div className="insight-section">
            <h4>📊 Data Analysis Summary</h4>
            <p className="period">Period Analyzed: <strong>{insights.period}</strong></p>
          </div>

          <div className="insight-section">
            <h4>🔑 Key Findings</h4>
            <ul>
              {insights.keyFindings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
          </div>

          <div className="insight-section">
            <h4>📈 Trend Analysis</h4>
            <p>{insights.trendAnalysis}</p>
          </div>

          <div className="insight-section">
            <h4>💡 Market Insights</h4>
            <p>{insights.marketInsights}</p>
          </div>

          <div className="insight-section recommendation">
            <h4>✨ Recommendation</h4>
            <p>{insights.recommendation}</p>
          </div>
        </div>
      )}

      {insights && insights.error && (
        <div className="insight-box error">
          <p>{insights.error}</p>
        </div>
      )}
    </div>
  );
};

export default EVAdoptionChartWithAI;

