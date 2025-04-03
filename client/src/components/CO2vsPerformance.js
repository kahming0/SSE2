import React, { useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label } from "recharts";

import {
  Box, Typography, FormControlLabel, Checkbox, InputLabel, Select, MenuItem
} from "@mui/material";

export default function CO2vsPerformance({ data }) {
  const [selectedArchitectures, setSelectedArchitectures] = useState([]);

  if (!data || data.length === 0) {
    return <div>Loading...</div>;
  }

  const architectures = [...new Set(data.map(item => item.Architecture).filter(Boolean))];

  const toggleArchitecture = (arch) => {
    setSelectedArchitectures((prev) =>
      prev.includes(arch)
        ? prev.filter((a) => a !== arch)
        : [...prev, arch]
    );
  };

  const allFormatted = data
    .map(item => ({
      model: item.fullname,
      co2: parseFloat(item["CO₂ cost (kg)"]),
      performance: parseFloat(item["Average ⬆️"]),
      architecture: item.Architecture,
    }))
    .filter(item => !isNaN(item.co2) && !isNaN(item.performance));

  const co2Values = allFormatted.map(d => d.co2);
  const perfValues = allFormatted.map(d => d.performance);
  const co2Domain = [Math.min(...co2Values), Math.max(...co2Values)];
  const perfDomain = [Math.min(...perfValues), Math.max(...perfValues)];

  const formatData = allFormatted.filter(item =>
    selectedArchitectures.length === 0 || selectedArchitectures.includes(item.architecture)
  );

  return (
    <div style={{ marginTop: "40px" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#2D3748" }}>
        CO₂ Emissions vs. Performance
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Filter by Architecture
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            maxWidth: 600
          }}
        >
          {architectures.map((arch) => (
            <FormControlLabel
              key={arch}
              control={
                <Checkbox
                  checked={selectedArchitectures.includes(arch)}
                  onChange={() => toggleArchitecture(arch)}
                />
              }
              label={arch}
            />
          ))}
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 80 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="co2" tick={{ fontSize: 12 }} domain={co2Domain}>
            <Label value="CO₂ Emission (kg)" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis type="number" dataKey="performance" tick={{ fontSize: 12 }} domain={perfDomain}>
            <Label value="Performance Score" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name, props) => {
              const formattedValue = value.toFixed(2);
              const modelName = props.payload.model; 
              const labelName = name === "co2" ? "CO₂ (kg)" : "Performance (0 - 100)";
              return [`${formattedValue}`, `${labelName} - ${modelName}`];
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                return `Model: ${payload[0].payload.model}`;
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
