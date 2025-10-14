// import React, { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
// import "./ModelMakeChart.css";

// const ModelMakeChart = () => {
//   const [data, setData] = useState([]);
//   const [selectedMake, setSelectedMake] = useState("");
//   const [models, setModels] = useState([]);

//   useEffect(() => {
//     fetch("/csvjson.json")
//       .then((res) => res.json())
//       .then((data) => setData(data))
//       .catch((err) => console.error("Error loading JSON:", err));
//   }, []);

//   const makes = [...new Set(data.map((item) => item.Make))].sort();

//   const handleMakeChange = (e) => {
//     const make = e.target.value;
//     setSelectedMake(make);

//     const filtered = data.filter((item) => item.Make === make);
//     const modelGroups = {};

//     filtered.forEach((item) => {
//       const model = item.Model;
//       if (!modelGroups[model]) {
//         modelGroups[model] = {
//           name: model,
//           count: 0,
//           avgPrice: 0,
//           avgRange: 0,
//         };
//       }
//       modelGroups[model].count += 1;
//       modelGroups[model].avgPrice += parseFloat(item["Base MSRP"]) || 0;
//       modelGroups[model].avgRange += parseFloat(item["Electric Range"]) || 0;
//     });

//     const modelData = Object.values(modelGroups).map((m) => ({
//       name: m.name,
//       avgPrice: m.avgPrice / m.count,
//       avgRange: m.avgRange / m.count,
//     }));

//     setModels(modelData);
//   };

//   return (
//     <div className="make-model-explorer">
//       <h2>🔍 Explore Models by Make</h2>

//       <select value={selectedMake} onChange={handleMakeChange} className="dropdown">
//         <option value="">Select a Make...</option>
//         {makes.map((make, idx) => (
//           <option key={idx} value={make}>{make}</option>
//         ))}
//       </select>

//       {selectedMake && (
//         <>
//           <h3>📊 Insights for {selectedMake}</h3>

//           <div className="model-stats">
//             <p><strong>Total Models:</strong> {models.length}</p>
//             <p>
//               <strong>Avg MSRP:</strong> $
//               {(
//                 models.reduce((sum, m) => sum + (m.avgPrice || 0), 0) / models.length
//               ).toFixed(0)}
//             </p>
//             <p>
//               <strong>Avg Range:</strong>{" "}
//               {(
//                 models.reduce((sum, m) => sum + (m.avgRange || 0), 0) / models.length
//               ).toFixed(0)} mi
//             </p>
//           </div>

//           <div className="chart-wrapper">
//             <ResponsiveContainer width="100%" height={400}>
//               <BarChart data={models} margin={{ top: 20, right: 30, left: 10, bottom: 80 }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="avgRange" fill="#82ca9d">
//                   <LabelList dataKey="avgRange" position="top" />
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ModelMakeChart;





import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../App.css";

const COLORS = ["#00ff9c", "#00c77a", "#29ffb5", "#80ffd6", "#007a4e"];

const ModelMakeChart = ({ makes = {} }) => {
  const [selectedMake, setSelectedMake] = useState(Object.keys(makes)[0] || "");
  const models = makes[selectedMake] || [];

  if (!makes || Object.keys(makes).length === 0) {
    return <div className="chart-container">Loading make data...</div>;
  }

  return (
    <div className="make-model-explorer">
      <h2>Model Distribution by Make</h2>
      <select
        className="dropdown"
        value={selectedMake}
        onChange={(e) => setSelectedMake(e.target.value)}
      >
        {Object.keys(makes).map((make) => (
          <option key={make} value={make}>
            {make}
          </option>
        ))}
      </select>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={420}>
          <PieChart>
            <Pie
              data={models}
              dataKey="Count"
              nameKey="Model"
              cx="50%"
              cy="50%"
              outerRadius={140}
              label={({ name }) => name}
            >
              {models.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#162024",
                border: "1px solid #00ff9c33",
                color: "#e6f4ea",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ModelMakeChart;
