import React from "react";
import "./App.css";
import EVCountByMake from "./components/EvCharts";
import RawCount from "./components/RawCount";
import EVAdaptionChart from "./components/EvAdaption";
import EVAdoptionComparison from "./components/EvComparision";
import EvTypePieChart from "./components/EvTypePieChart";
import TopCounties from "./components/TopCounties";
import EVMap from "./components/EvMap";

function App() {
  return (
    <div className="app">
     
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <div className="logo-icon">⚡</div>
            <div className="brand-text">
              <h1>Electric Vehicle Analytics</h1>
              <p className="subtitle">Comprehensive EV Market Intelligence Dashboard</p>
            </div>
          </div>
          <div className="header-meta">
            <span className="data-badge">Live Data</span>
            <span className="date-badge">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </header>

      {/* Key Metrics Section */}
      <section className="metrics-section">
        <h2 className="section-title">Key Metrics Overview</h2>
        <RawCount />
      </section>

      {/* Analytics Grid */}
      <section className="analytics-section">
        <h2 className="section-title">Market Analytics</h2>
        <div className="charts-grid">
          <div className="chart-card">
            <EVCountByMake />
          </div>
          <div className="chart-card">
            <EVAdaptionChart />
          </div>
          <div className="chart-card">
            <EvTypePieChart />
          </div>
          <div className="chart-card">
            <TopCounties />
          </div>
        </div>
      </section>

      {/* Deep Dive Analysis */}
      <section className="deep-dive-section">
        <h2 className="section-title">Deep Dive Analysis</h2>
        <div className="analysis-cards">
          <div className="chart-card full-width">
            <EVAdoptionComparison />
          </div>
        </div>
      </section>

      {/* Geographic Distribution Map */}
      <section className="map-section">
        <h2 className="section-title">Geographic Distribution</h2>
        <div className="chart-card full-width">
          <EVMap />
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Built with React + Recharts + Leaflet | Data visualization for EV market analysis</p>
      </footer>
    </div>
  );
}

export default App;
