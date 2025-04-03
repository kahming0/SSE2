import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

export default function TopCO2({ data }) {
  const sorted = [...data].sort((a, b) => a["CO₂ cost (kg)"] - b["CO₂ cost (kg)"]);
  const lowest = sorted.slice(0, 10);
  const highest = sorted.slice(-10).reverse();

  const formatData = (arr) =>
    arr.map((item) => ({
      name: item.fullname,
      co2: parseFloat(item["CO₂ cost (kg)"].toFixed(2)),
    }));

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2D3748" }}>
        Top 10 Lowest CO₂ Models (KG)
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={formatData(lowest)} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={180} />
          <Tooltip formatter={(value) => value.toFixed(2)} /> 
          <Bar dataKey="co2" fill="#48BB78">
            <LabelList dataKey="co2" position="right" formatter={(value) => value.toFixed(2)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2D3748" }}>
        Top 10 Highest CO₂ Models (KG)
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={formatData(highest)} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={180} />
          <Tooltip formatter={(value) => value.toFixed(2)} />
          <Bar dataKey="co2" fill="#F56565">
            <LabelList dataKey="co2" position="right" formatter={(value) => value.toFixed(2)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
