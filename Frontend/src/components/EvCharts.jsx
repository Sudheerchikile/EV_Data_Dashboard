
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import "./EvCharts.css";

const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const val = item[key];
    if (!acc[val]) acc[val] = [];
    acc[val].push(item);
    return acc;
  }, {});
};

function EVCountByMake() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    evType: "All",
    yearRange: [2010, 2025],
  });

  useEffect(() => {
    fetch("/csvjson.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // Extract unique filter options
  const evTypes = ["All", ...new Set(data.map((d) => d["Electric Vehicle Type"]).filter(Boolean))];
  const minYear = Math.min(...data.map((d) => d["Model Year"] || 0));
  const maxYear = Math.max(...data.map((d) => d["Model Year"] || 0));

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters dynamically
  useEffect(() => {
    let filtered = data;

    if (filters.evType !== "All") {
      filtered = filtered.filter((d) => d["Electric Vehicle Type"] === filters.evType);
    }

    // Removed CAFV filter

    filtered = filtered.filter(
      (d) => d["Model Year"] >= filters.yearRange[0] && d["Model Year"] <= filters.yearRange[1]
    );

    setFilteredData(filtered);
  }, [filters, data]);

  // Group and prepare data for chart
  const grouped = groupBy(filteredData, "Make");
  const makeCount = Object.entries(grouped)
    .map(([make, items]) => ({
      name: make || "Unknown",
      count: items.length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return (
    <div className="chart-container">
      <h2 className="chart-title">🚗 Top 10 EV Makes by Vehicle Count</h2>

      {/* 🔽 Filters Section */}
      <div className="filters">
        <div>
          <label>EV Type:</label>
          <select
            value={filters.evType}
            onChange={(e) => handleFilterChange("evType", e.target.value)}
          >
            {evTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Model Year:</label>
          <input
            type="number"
            min={minYear}
            max={maxYear}
            value={filters.yearRange[0]}
            onChange={(e) =>
              handleFilterChange("yearRange", [Number(e.target.value), filters.yearRange[1]])
            }
          />
          <span> - </span>
          <input
            type="number"
            min={minYear}
            max={maxYear}
            value={filters.yearRange[1]}
            onChange={(e) =>
              handleFilterChange("yearRange", [filters.yearRange[0], Number(e.target.value)])
            }
          />
        </div>
      </div>

      {/* 📊 Bar Chart */}
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={makeCount} margin={{ top: 20, right: 30, left: 10, bottom: 90 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
          />
          <YAxis tick={{ fill: "#cbd5e1" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
          />
          <Legend wrapperStyle={{ color: "#e2e8f0", paddingTop: "20px" }} />
          <Bar
            dataKey="count"
            name="Number of Vehicles"
            fill="url(#colorGradient)"
            radius={[6, 6, 0, 0]}
            barSize={35}
          >
            <LabelList dataKey="count" position="top" fill="#f1f5f9" fontSize={12} dy={-8} />
          </Bar>

          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EVCountByMake;
