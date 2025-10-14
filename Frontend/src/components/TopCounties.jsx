import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./TopCounties.css";

const TopCounties = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/csvjson.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // Group by County and count
  const countyCount = {};
  data.forEach((ev) => {
    const county = ev.County;
    if (county) {
      countyCount[county] = (countyCount[county] || 0) + 1;
    }
  });

  // Format for chart - Top 10 counties
  const chartData = Object.entries(countyCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Color gradient based on value
  const getColor = (index) => {
    const colors = [
      "#3b82f6", // Blue
      "#60a5fa",
      "#93c5fd",
      "#10b981", // Green
      "#34d399",
      "#6ee7b7",
      "#f59e0b", // Orange
      "#fbbf24",
      "#fcd34d",
      "#94a3b8", // Gray
    ];
    return colors[index] || "#64748b";
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="county-tooltip">
          <p className="tooltip-county">{payload[0].payload.name} County</p>
          <p className="tooltip-count">{payload[0].value.toLocaleString()} EVs</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="top-counties-container">
      <h3 className="chart-title">Top 10 Counties by EV Registrations</h3>
      <p className="chart-note">Counties are administrative regions in Washington State (e.g., King County includes Seattle, Bellevue, Redmond)</p>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart 
          data={chartData} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <XAxis type="number" stroke="#94a3b8" />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#94a3b8"
            width={70}
            tick={{ fill: '#f1f5f9', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCounties;
