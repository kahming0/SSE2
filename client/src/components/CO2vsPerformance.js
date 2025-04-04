import React, { useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label } from "recharts";

import {
  Button, Box, Typography, FormControlLabel, Checkbox, InputLabel, Select, MenuItem,
  Collapse
} from "@mui/material";

export default function CO2vsPerformance({ data }) {
  const [selectedArchitectures, setSelectedArchitectures] = useState([]);
  const [showFilters, setShowFilters] = useState(false);


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
      co2: parseFloat(item["CO₂ cost (kg)"]).toFixed(2),
      performance: parseFloat(item["Average ⬆️"]).toFixed(2),
      architecture: item.Architecture,
    }))
    .filter(item => !isNaN(item.co2) && !isNaN(item.performance));

  const co2Values = allFormatted.map(d => d.co2);
  const perfValues = allFormatted.map(d => d.performance);
  const co2Domain = [0, Math.max(...co2Values)];
  const perfDomain = [0, Math.max(...perfValues)];

  const formatData = allFormatted.filter(item =>
    selectedArchitectures.length === 0 || selectedArchitectures.includes(item.architecture)
  );

  const groupedByArch = {};
  formatData.forEach(item => {
    if (!groupedByArch[item.architecture]) {
      groupedByArch[item.architecture] = [];
    }

    groupedByArch[item.architecture].push(item);
  });

  const generateColorFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = "#" + ((hash >> 24) & 0xff).toString(16).padStart(2, '0') +
                        ((hash >> 16) & 0xff).toString(16).padStart(2, '0') +
                        ((hash >> 8) & 0xff).toString(16).padStart(2, '0');
    return color.slice(0, 7);
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#2D3748" }}>
        CO₂ Emissions vs. Performance
      </Typography>
      <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outlined"
              size="small"
              sx={{ textTransform: "none", ml: 1 }}
              style={{ width : "50%" }}
            >
              {showFilters ? "Hide Search Filters" : "Show Search Filters"}
            </Button>
      <Collapse in={showFilters}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Filter by Architecture
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
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
      </Collapse>

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
              const formattedValue = value;
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
          <Legend verticalAlign="top" height={60} wrapperStyle={{ overflowX: 'auto', whiteSpace: 'nowrap'}} />
          {Object.entries(groupedByArch).map(([arch, items]) => (
            <Scatter key={arch} name={arch} data={items} fill={generateColorFromString(arch)} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
