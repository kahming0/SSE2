import { useState } from "react";
import data from "../konbert-output-323e23e4.json";
import Select from 'react-select'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Co2Comparison() {
  const [selectedModels, setSelectedModels] = useState([]);

  const removeModel = (model) => {
    setSelectedModels(selectedModels.filter((m) => m !== model));
  };

  const chartData = selectedModels.map((model) => {
    const modelData = data.find((item) => item.fullname === model);
    return { name: model, co2: modelData ? modelData["CO₂ cost (kg)"] : 0 };
  });

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2D3748" }}>Compare CO₂ Costs</h2>
      
      <div style={{ marginBottom: "16px" }}>
        <Select
          options={data.map((item) => ({
            value: item.fullname,
            label: item.fullname,
          }))}
          onChange={(selectedOption) => {
            if (!selectedOption) return;
            const value = selectedOption.value;
            if (!selectedModels.includes(value) && selectedModels.length < 5) {
              setSelectedModels([...selectedModels, value]);
            }
          }}
          placeholder="Select a model"
          isSearchable
          styles={{
            control: (base) => ({
              ...base,
              border: "1px solid #E2E8F0",
              padding: "2px",
              borderRadius: "4px",
              marginRight: "8px",
            }),
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
        {selectedModels.map((model) => (
          <div
            key={model}
            style={{
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#F7FAFC",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
            }}
          >
            {model}
            <button
              style={{
                backgroundColor: "transparent",
                border: "1px solid #E2E8F0",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "12px",
                cursor: "pointer",
                color: "#E53E3E"
              }}
              onClick={() => removeModel(model)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="co2" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
