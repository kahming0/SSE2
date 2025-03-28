import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import Select from 'react-select'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart,
  Scatter, CartesianGrid, Legend, Label, LabelList,
} from "recharts";
import { useNavigate } from "react-router-dom";

// const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
// const checkbox_labels = ["Average ⬆️", "IFEval", "BBH", "MATH Lvl 5", "GPQA", "MUSR", "MMLU-PRO"];  // Just a heads up we need the emoji to get the average data


const MODES = {
  CO2: "CO₂ Compare",
  SCATTER: "CO₂ vs Performance",
};

function getCO2Equivalents(co2Kg) {
  return {
    kmsDriven: ((co2Kg / 0.393) * 1.60934).toFixed(0),
    smartphonesCharged: (co2Kg / 0.0124).toFixed(0),
  };
}

export default function Co2Comparison({data}) {
  // console.log(data);
  const [selectedModels, setSelectedModels] = useState([]);
  const [mode, setMode] = useState(MODES.CO2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const removeModel = (model) => {
    setSelectedModels(selectedModels.filter((m) => m !== model));
  };

  const chartData = selectedModels.map((model) => {
    const modelData = data.find((item) => item.fullname === model);
    return {
      name: model,
      co2: modelData ? parseFloat(modelData["CO₂ cost (kg)"]).toFixed(2) : 0,
      performance: modelData ? parseFloat(modelData["Average ⬆️"]).toFixed(2) : null,
      chat_template: modelData["Chat Template"] ? "Yes" : "No",
      energy_rating: "Placeholder",
    }
  });

  const handleModelChange = (selectedOption) => {
    if (!selectedOption) return;
    const value = selectedOption.value;
    if (!selectedModels.includes(value) && selectedModels.length < 5) {
      setSelectedModels([...selectedModels, value]);
    }
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
    //setSelectedModels([]);
  };

  // const navigate = useNavigate();

  const handleClick = (data) => {
    //navigate (`/model/${encodeURIComponent(data.name)}`);
    setSelectedModel(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedModel(null);
  };

  const equivalents = selectedModel ? getCO2Equivalents(selectedModel.co2) : null;

  const [modelToRemove, setModelToRemove] = useState(null);

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2D3748" }}>Compare CO₂ Costs</h2>

      <div style={{ marginBottom: "16px" }}>
        <select
          onChange={handleModeChange}
          value={mode}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #CBD5E0",
            marginBottom: "8px",
          }}
        >
          {Object.values(MODES).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <Select
          options={data.map((item) => ({
            value: item.fullname,
            label: item.fullname,
          }))}
          onChange={handleModelChange}
          placeholder="Select a model"
          isSearchable
          styles={{
            control: (base) => ({
              ...base,
              border: "1px solid #E2E8F0",
              padding: "2px",
              borderRadius: "4px",
              marginRight: "8px",
			  width: "50%",
			  display: "inline-flex",
            }),
          }}
        />
		<div style={{width: "50%", display:"inline-flex" }}>

		</div>

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
              onClick={() => setModelToRemove(model)}
            >
              ✕
            </button>
            <Dialog
              open={Boolean(modelToRemove)}
              onClose={() => setModelToRemove(null)}
            >
              <DialogTitle>Remove Model</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to remove <strong>{modelToRemove}</strong> from the comparison?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setModelToRemove(null)} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    removeModel(modelToRemove);
                    setModelToRemove(null);
                  }}
                  color="error"
                  variant="contained"
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        { mode === MODES.CO2 ? (
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
            formatter={(value, name) => {
              const formattedValue = value;
              return [formattedValue, name === "co2" ? "CO₂ (kg)" : "Performance"];
            }}
            labelFormatter={(label) => `Model: ${label}`} />
			{<Bar dataKey="co2"     fill="#8884d8" onClick={handleClick} LabelList={{dataKey:"co2", position:"top"}} />}
			</BarChart>
        ) : (
          <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 60 }}>
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
              <Label value="Performance Score" angle={-90} position="center" />
            </YAxis>
            <Tooltip
              labelFormatter={(label) => `Model: ${label}`}
            />
              <Scatter name="Models" data={chartData} fill="#3182CE" onClick={handleClick}>
                <LabelList dataKey="name" position="top" />
            </Scatter>
          </ScatterChart>
        )}
      </ResponsiveContainer>

      {isModalOpen && selectedModel && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "8px",
            minWidth: "300px",
            maxWidth: "500px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}>
            <h2>{selectedModel.name}</h2>
            <ul>
              <li><strong>CO₂ Cost (kg):</strong> {selectedModel.co2}</li>
              <li><strong>Performance:</strong> {selectedModel.performance}</li>
              <li>
                <strong>Chat Template:</strong> {selectedModel.chat_template}
              </li>
              <li><strong>Energy Efficiency Rating:</strong> A (Placeholder)</li>
            </ul>

            <hr style={{ margin: "16px 0" }} />

            <div>
              <h3 style={{ fontWeight: "bold", marginBottom: "8px" }}>CO₂-to-Everyday Equivalent:</h3>
              <ul style={{ listStyle: "disc", marginLeft: "20px" }}>
                <li>{equivalents.kmsDriven} km driven</li>
                <li>{equivalents.smartphonesCharged} smartphones charged</li>
              </ul>
            </div>

            <button
              onClick={closeModal}
              style={{
                backgroundColor: "#E53E3E",
                padding: "8px 16px",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
