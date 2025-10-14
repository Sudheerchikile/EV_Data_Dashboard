import React, { useEffect, useState } from 'react';
import './RawCount.css';

const RawCount = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/csvjson.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading JSON:", err);
        setLoading(false);
      });
  }, []);

  const totalVehicles = data.length;
  const bevData = data.filter(ev => ev["Electric Vehicle Type"] === "Battery Electric Vehicle (BEV)");
  const nonBevData = data.filter(ev => ev["Electric Vehicle Type"] !== "Battery Electric Vehicle (BEV)");

  const totalBEV = bevData.length;
  const totalNonBEV = nonBevData.length;

  const bevPercent = totalVehicles ? ((totalBEV / totalVehicles) * 100).toFixed(1) : 0;
  const nonBevPercent = totalVehicles ? ((totalNonBEV / totalVehicles) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="rawcount-container">
        <div className="metric-card skeleton">
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rawcount-container">
      <div className="metric-card total">
        <div className="metric-icon">🚗</div>
        <div className="metric-content">
          <h3>Total Vehicles</h3>
          <p className="metric-value">{totalVehicles.toLocaleString()}</p>
          <span className="metric-label">Registered EVs</span>
        </div>
        <div className="metric-badge all">All Types</div>
      </div>

      <div className="metric-card bev">
        <div className="metric-icon">🔋</div>
        <div className="metric-content">
          <h3>Battery Electric (BEV)</h3>
          <p className="metric-value">{totalBEV.toLocaleString()}</p>
          <div className="metric-footer">
            <span className="metric-percent">{bevPercent}%</span>
            <span className="metric-label">of total fleet</span>
          </div>
        </div>
        <div className="metric-badge bev-badge">Pure Electric</div>
      </div>

      <div className="metric-card phev">
        <div className="metric-icon">⚡</div>
        <div className="metric-content">
          <h3>Plug-in Hybrid (PHEV)</h3>
          <p className="metric-value">{totalNonBEV.toLocaleString()}</p>
          <div className="metric-footer">
            <span className="metric-percent">{nonBevPercent}%</span>
            <span className="metric-label">of total fleet</span>
          </div>
        </div>
        <div className="metric-badge phev-badge">Hybrid</div>
      </div>
    </div>
  );
};

export default RawCount;
