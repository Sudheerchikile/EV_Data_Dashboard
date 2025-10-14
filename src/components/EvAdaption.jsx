// import React, { useEffect, useState } from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import "./EvAdopation.css";

// const EVAdoptionChart = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetch("/csvjson.json")
//       .then((res) => res.json())
//       .then((data) => setData(data))
//       .catch((err) => console.error("Error loading JSON:", err));
//   }, []);

//   // ✅ Group by Model Year
//   const yearCountMap = {};
//   data.forEach((ev) => {
//     const year = ev["Model Year"];
//     if (year) {
//       yearCountMap[year] = (yearCountMap[year] || 0) + 1;
//     }
//   });

//   // ✅ Convert to array sorted by year
//   const yearData = Object.entries(yearCountMap)
//     .map(([year, count]) => ({ year, count }))
//     .sort((a, b) => Number(a.year) - Number(b.year));

//   return (
//     <div className="chart-container">
//       <h2>EV Adoption Over Time (by Model Year)</h2>
//       <ResponsiveContainer width="100%" height={400}>
//         <LineChart data={yearData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="year" label={{ value: "Model Year", position: "insideBottom", offset: -5 }} />
//           <YAxis label={{ value: "Number of Vehicles", angle: -90, position: "insideLeft" }} />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="count"
//             stroke="#4caf50"
//             strokeWidth={3}
//             dot={{ r: 4 }}
//             activeDot={{ r: 6 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default EVAdoptionChart;




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
import "./EvAdopation.css"

const EVAdaptionChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMake, setSelectedMake] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [yearRange, setYearRange] = useState({ min: 2010, max: 2025 });

  useEffect(() => {
    fetch("/csvjson.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // Extract unique makes and vehicle types
  const makes = ["All", ...new Set(data.map((ev) => ev.Make))];
  const types = ["All", ...new Set(data.map((ev) => ev["Electric Vehicle Type"]))];

  // ✅ Filter data dynamically
  useEffect(() => {
    let filtered = data;

    if (selectedMake !== "All") {
      filtered = filtered.filter((ev) => ev.Make === selectedMake);
    }

    if (selectedType !== "All") {
      filtered = filtered.filter((ev) => ev["Electric Vehicle Type"] === selectedType);
    }

    filtered = filtered.filter(
      (ev) =>
        ev["Model Year"] >= yearRange.min &&
        ev["Model Year"] <= yearRange.max
    );

    setFilteredData(filtered);
  }, [selectedMake, selectedType, yearRange, data]);

  // ✅ Group by Model Year
  const yearCountMap = {};
  filteredData.forEach((ev) => {
    const year = ev["Model Year"];
    if (year) {
      yearCountMap[year] = (yearCountMap[year] || 0) + 1;
    }
  });

  const yearData = Object.entries(yearCountMap)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => Number(a.year) - Number(b.year));

  return (
    <div className="chart-container">
      <h2>⚡ EV Adoption Over Time (By Model Year)</h2>

      {/* Filters */}
      <div className="filters">
        <div>
          <label>Make:</label>
          <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Vehicle Type:</label>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Year Range:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="number"
              value={yearRange.min}
              min="2010"
              max={yearRange.max - 1}
              onChange={(e) => setYearRange({ ...yearRange, min: Number(e.target.value) })}
            />
            <span> to </span>
            <input
              type="number"
              value={yearRange.max}
              min={yearRange.min + 1}
              max="2025"
              onChange={(e) => setYearRange({ ...yearRange, max: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={yearData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" label={{ value: "Model Year", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: "Number of Vehicles", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#4caf50"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EVAdaptionChart;
