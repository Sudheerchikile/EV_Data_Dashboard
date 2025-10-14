import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import "./EvTypePieChart.css";

const EvTypePieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/csvjson.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // Group by Electric Vehicle Type
  const typeCount = {};
  data.forEach((ev) => {
    const type = ev["Electric Vehicle Type"];
    if (type) {
      typeCount[type] = (typeCount[type] || 0) + 1;
    }
  });

  // Format for Recharts PieChart
  const pieData = Object.entries(typeCount).map(([name, value]) => ({
    name: name === "Battery Electric Vehicle (BEV)" ? "BEV" : "PHEV",
    fullName: name,
    value,
    percentage: ((value / data.length) * 100).toFixed(1)
  }));

  // Professional colors matching the theme
  const COLORS = ["#3b82f6", "#10b981"];

  // Custom label
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight={600}
      >
        {`${percentage}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.fullName}</p>
          <p className="tooltip-value">{payload[0].value.toLocaleString()} vehicles</p>
          <p className="tooltip-percent">{payload[0].payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="ev-type-pie-container">
      <h3 className="chart-title">EV Type Distribution</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: '#f1f5f9', fontSize: '14px' }}>
                {entry.payload.fullName}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvTypePieChart;
