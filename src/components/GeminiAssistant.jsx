import React, { useState } from "react";
import "./GeminiAssistant.css";

const GeminiAssistant = ({ allChartsData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getApiUrl = () => {
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5000'
      : 'https://ev-data-dashboard.onrender.com';
  };

  const generateInsights = async () => {
    setLoading(true);
    setError("");
    setInsights("");

    try {
      // Prepare comprehensive data summary
      const dataSummary = {
        topMakes: allChartsData.topMakes?.slice(0, 5) || [],
        evTypes: allChartsData.evTypes || [],
        topCounties: allChartsData.topCounties?.slice(0, 5) || [],
        adoptionTrend: allChartsData.adoptionTrend?.slice(-5) || [], // Last 5 years
        totalVehicles: allChartsData.totalVehicles || 0,
      };

      const response = await fetch(`${getApiUrl()}/api/generate-insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: dataSummary,
          filters: {
            context: "Complete EV Dashboard Analysis",
            requestType: "comprehensive_insights"
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
      setError(
        err.message.includes("fetch") 
          ? "⚠️ Backend server not running. Please start the backend with 'npm start' in the Backend folder."
          : "Failed to generate insights. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Assistant Button */}
      <button
        className="gemini-assistant-button"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Insights Assistant"
      >
        <span className="assistant-icon">✨</span>
        <span className="assistant-text">AI Insights</span>
      </button>

      {/* Assistant Panel */}
      {isOpen && (
        <div className="gemini-assistant-panel">
          <div className="assistant-header">
            <div className="header-content">
              <span className="gemini-logo">🤖</span>
              <div>
                <h3>Gemini AI Assistant</h3>
                <p className="assistant-subtitle">Powered by Google Gemini</p>
              </div>
            </div>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="assistant-body">
            {!insights && !loading && !error && (
              <div className="welcome-message">
                <p>👋 Hi! I can analyze all your dashboard data and provide intelligent insights about EV adoption trends, market patterns, and geographic distribution.</p>
                <button className="generate-button" onClick={generateInsights}>
                  🔍 Generate Insights
                </button>
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Analyzing your data with AI...</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button className="retry-button" onClick={generateInsights}>
                  🔄 Retry
                </button>
              </div>
            )}

            {insights && (
              <div className="insights-content">
                <div className="insights-header">
                  <span className="insights-badge">AI Analysis</span>
                  <button className="refresh-button" onClick={generateInsights}>
                    🔄 Regenerate
                  </button>
                </div>
                <div className="insights-text">
                  {insights.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="assistant-footer">
            <span className="footer-text">💡 Insights based on your dashboard data</span>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;
