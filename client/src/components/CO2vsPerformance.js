import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Label } from "recharts";

export default function CO2vsPerformance({ data }) {
  // Check if data is loaded
  if (!data || data.length === 0) {
    return <div>Loading...</div>; // Show a loading message if data is undefined or empty
  }

  const formatData = data
    .map((item) => {
      const co2 = parseFloat(item["CO₂ cost (kg)"]);
      const performance = parseFloat(item["Average ⬆️"]);

      return {
        name: item.fullname,
        co2,
        performance,
      };
    })
    .filter((item) => !isNaN(item.co2) && !isNaN(item.performance)); 

  console.log(formatData);
  console.log(Object.keys(data[0]));  // Debugging line

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2D3748" }}>
        CO₂ Emissions vs. Performance
      </h2>
      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart
          margin={{ top: 20, right: 40, bottom: 40, left: 80 }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="co2"
            name="CO₂ (kg)"
            tick={{ fontSize: 12 }}
          >
            <Label value="CO₂ Emission (kg)" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis
            type="number"
            dataKey="performance"
            name="Performance"
            tick={{ fontSize: 12 }}
          >
            <Label value="Performance Score" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name) => [value, name === "co2" ? "CO₂ (kg)" : "Performance"]}
            labelFormatter={(label) => `Model: ${label}`}
          />
          <Legend />
          <Scatter name="Models" data={formatData} fill="#3182CE" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
