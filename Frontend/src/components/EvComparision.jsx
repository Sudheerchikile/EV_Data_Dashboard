import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
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
import "./EvComparision.css";

// API URL configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000'
  : window.location.origin;

const EVAdoptionComparison = () => {
  const [data, setData] = useState([]);
  const [selectedMake1, setSelectedMake1] = useState("BMW");
  const [selectedMake2, setSelectedMake2] = useState("CHRYSLER");
  const [yearRange, setYearRange] = useState({ min: 2010, max: 2025 });
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    fetch("/csvjson.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // ✅ Extract unique makes
  const makes = [...new Set(data.map((ev) => ev.Make))].sort();

  // ✅ Helper to group by Model Year
  const groupByYear = (filtered) => {
    const yearCount = {};
    filtered.forEach((ev) => {
      const year = ev["Model Year"];
      if (year >= yearRange.min && year <= yearRange.max) {
        yearCount[year] = (yearCount[year] || 0) + 1;
      }
    });
    return yearCount;
  };

  // ✅ Filter for each selected make
  const make1Data = groupByYear(data.filter((ev) => ev.Make === selectedMake1));
  const make2Data = groupByYear(data.filter((ev) => ev.Make === selectedMake2));

  // ✅ Merge both into one dataset for chart
  const allYears = [
    ...new Set([
      ...Object.keys(make1Data),
      ...Object.keys(make2Data),
    ]),
  ].sort((a, b) => Number(a) - Number(b));

  const chartData = allYears.map((year) => ({
    year,
    [selectedMake1]: make1Data[year] || 0,
    [selectedMake2]: make2Data[year] || 0,
  }));

  // Generate AI insights for this specific comparison
  const generateInsights = async () => {
    setLoading(true);
    setInsights("");
    setShowInsights(true);

    try {
      const comparisonData = {
        make1: selectedMake1,
        make2: selectedMake2,
        yearRange: yearRange,
        chartData: chartData,
        make1Total: Object.values(make1Data).reduce((a, b) => a + b, 0),
        make2Total: Object.values(make2Data).reduce((a, b) => a + b, 0),
      };

      const response = await fetch(`${API_BASE_URL}/api/generate-insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: comparisonData,
          filters: {
            context: "EV Adoption Comparison Analysis",
            requestType: "comparison_insights",
            makes: [selectedMake1, selectedMake2]
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      setInsights(result.insight || "No insights generated.");
    } catch (err) {
      console.error("Error generating insights:", err);
      setInsights(
        "⚠️ Unable to generate insights. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h2>📈 EV Adoption Comparison Between Two Makes</h2>
        <button 
          className="ai-insights-btn" 
          onClick={generateInsights}
          disabled={loading}
        >
          {loading ? "⏳ Analyzing..." : "✨ Generate AI Insights"}
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div>
          <label>Select Make 1:</label>
          <select
            value={selectedMake1}
            onChange={(e) => setSelectedMake1(e.target.value)}
          >
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Make 2:</label>
          <select
            value={selectedMake2}
            onChange={(e) => setSelectedMake2(e.target.value)}
          >
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Year Range:</label>
          <input
            type="number"
            value={yearRange.min}
            min="2010"
            max={yearRange.max - 1}
            onChange={(e) =>
              setYearRange({ ...yearRange, min: Number(e.target.value) })
            }
          />
          <span> to </span>
          <input
            type="number"
            value={yearRange.max}
            min={yearRange.min + 1}
            max="2025"
            onChange={(e) =>
              setYearRange({ ...yearRange, max: Number(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#cbd5e1" }}
            label={{ value: "Model Year", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            tick={{ fill: "#cbd5e1" }}
            label={{
              value: "Number of Vehicles",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              color: "#f1f5f9",
              borderRadius: "8px",
            }}
          />
          <Legend wrapperStyle={{ color: "#e2e8f0" }} />

          {/* Line 1 */}
          <Line
            type="monotone"
            dataKey={selectedMake1}
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          {/* Line 2 */}
          <Line
            type="monotone"
            dataKey={selectedMake2}
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* AI Insights Section */}
      {showInsights && (
        <div className="insights-section">
          <div className="insights-header-section">
            <h3>🤖 AI-Powered Insights</h3>
            <button 
              className="close-insights-btn" 
              onClick={() => setShowInsights(false)}
            >
              ✕
            </button>
          </div>
          {loading ? (
            <div className="insights-loading">
              <div className="spinner-small"></div>
              <p>Analyzing comparison data with AI...</p>
            </div>
          ) : (
            <div className="insights-content-box markdown-content">
              <ReactMarkdown>{insights}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EVAdoptionComparison;
