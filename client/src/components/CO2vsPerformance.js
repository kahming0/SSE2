import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label } from "recharts";

export default function CO2vsPerformance({ data }) {
  if (!data || data.length === 0) {
    return <div>Loading...</div>;
  }

  const formatData = data
    .map((item) => ({
      model: item.fullname, // Store the model name
      co2: parseFloat(item["CO₂ cost (kg)"]),
      performance: parseFloat(item["Average ⬆️"]),
    }))
    .filter((item) => !isNaN(item.co2) && !isNaN(item.performance));

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2D3748" }}>
        CO₂ Emissions vs. Performance
      </h2>
      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 80 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="co2" tick={{ fontSize: 12 }} domain={["auto", "auto"]}>
            <Label value="CO₂ Emission (kg)" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis type="number" dataKey="performance" tick={{ fontSize: 12 }} domain={["auto", "auto"]}>
            <Label value="Performance Score" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name) => {
              const formattedValue = value.toFixed(2);
              return [formattedValue, name === "co2" ? "CO₂ (kg)" : "Performance"];
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                // console.log(`Model: ${payload[0].payload.model}`);
                return `Model: ${payload[0].payload.model}`; // Use model name
              }
              return `Model: Unknown`;
            }}
          />
          <Legend />
          <Scatter name="Models" data={formatData} fill="#3182CE" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
