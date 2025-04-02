import { useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from 'react-select';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart,
  Scatter, CartesianGrid, Legend, Label, LabelList,
} from "recharts";
import { useNavigate } from "react-router-dom";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const checkbox_labels = ["Average ⬆️", "IFEval", "BBH", "MATH Lvl 5", "GPQA", "MUSR", "MMLU-PRO"];  // Just a heads up we need the emoji to get the average data


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

export default function Co2Comparison({ data }) {
  // console.log(data);
  const [selectedModels, setSelectedModels] = useState([]);
  const [mode, setMode] = useState(MODES.CO2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const removeModel = (model) => {
    setSelectedModels(selectedModels.filter((m) => m !== model));
  };

  // Checkbox states. Fills it with an array of length checkbox_labels so if we add more please add it there.
  const [checkstates, checkboxStates] = useState(Array(checkbox_labels.length).fill(false));

  const [graphState, setGraphState] = useState(false);

  // Handles what happens when you press a checkbox. Simply toggles the target box on or off. It is a bit convoluted but apparently needed for this.
  const handleChange = (event, pos) => {
    const copy = [];
    var gState = false;
    for (let i = 0; i < checkstates.length; i++) {
      if (i == pos) {
        copy[i] = event.target.checked;
      } else {
        copy[i] = checkstates[i];
      }
      // True if anything of the checkboxstates is true
      gState = gState || copy[i];
    }
    checkboxStates(copy);

    // If graphstate is false we show co2. If it is true we do not show it.
    setGraphState(gState);
  };

  const keyMapping = {
    average: "Average",
    moe: "IFEval",
    bbh: "BBH",
    mth: "MATH",
    gpqa: "GPQA",
    musr: "MUSR",
    mmlupro: "MMLU-PRO",
  };

  const chartData = selectedModels.map((model) => {
    const modelData = data.find((item) => item.fullname === model);
    return {
      name: model,
      co2: modelData ? parseFloat(modelData["CO₂ cost (kg)"]).toFixed(2) : 0,
      performance: modelData ? parseFloat(modelData["Average ⬆️"]).toFixed(2) : null,
      chat_template: modelData["Chat Template"] ? "Yes" : "No",
      energy_rating: "Placeholder",
      average: modelData ? parseFloat(modelData[checkbox_labels[0]]).toFixed(2) : 0,
      moe: modelData ? parseFloat(modelData[checkbox_labels[1]]).toFixed(2) : 0,
      bbh: modelData ? parseFloat(modelData[checkbox_labels[2]]).toFixed(2) : 0,
      mth: modelData ? parseFloat(modelData[checkbox_labels[3]]).toFixed(2) : 0,
      gpqa: modelData ? parseFloat(modelData[checkbox_labels[4]]).toFixed(2) : 0,
      musr: modelData ? parseFloat(modelData[checkbox_labels[5]]).toFixed(2) : 0,
      mmlupro: modelData ? parseFloat(modelData[checkbox_labels[6]]).toFixed(2) : 0
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

  const navigate = useNavigate();

  const handleClick = (data) => {
    //navigate (`/model/${encodeURIComponent(data.name)}`);
    setSelectedModel(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedModel(null);
  };

  const featureMap = [
    { label: "🌱 Environmental Impact", type: "section" },
    { label: "CO₂ Cost (kg)", key: "CO₂ cost (kg)", transform: (val) => val?.toFixed(2) },
    { label: "kms Driven", key: "CO₂ cost (kg)", transform: (val) => ((val / 0.393) * 1.60934).toFixed(0) },
    { label: "Smartphones Charged", key: "CO₂ cost (kg)", transform: (val) => (val / 0.0124).toFixed(0) },


    { label: "📊 Performance (0 - 100)", type: "section" },
    { label: "Average", key: "Average ⬆️", transform: (val) => val?.toFixed(2) },
    { label: "IFEval", key: "IFEval", transform: (val) => val?.toFixed(2) },
    { label: "BBH", key: "BBH", transform: (val) => val?.toFixed(2) },
    { label: "MATH Lvl 5", key: "MATH Lvl 5", transform: (val) => val?.toFixed(2) },
    { label: "GPQA", key: "GPQA", transform: (val) => val?.toFixed(2) },
    { label: "MUSR", key: "MUSR", transform: (val) => val?.toFixed(2) },
    { label: "MMLU-PRO", key: "MMLU-PRO", transform: (val) => val?.toFixed(2) },




    { label: "🧠 Model Info", type: "section" },
    { label: "Architecture", key: "Architecture" },
    { label: "HuggingFace Link", key: "Model", isHTML: true },
    { label: "Upload Date", key: "Upload To Hub Date" },
    { label: "Precision", key: "Precision" },
    { label: "Weight Type", key: "Weight type" },
    { label: "Hub License", key: "Hub License" },
    { label: "Available on Hub", key: "Available on the hub" },
    { label: "#Params (B)", key: "#Params (B)" },
    { label: "Chat Template", key: "Chat Template" },
  ];

  const equivalents = selectedModel ? getCO2Equivalents(selectedModel.co2) : null;

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2D3748" }}>Compare CO₂ Costs For Benchmarks</h2>

      <div style={{ marginBottom: "16px" }}>
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
        <div style={{ width: "50%", display: "inline-flex" }}>

          <FormGroup style={{ display: "inline-block" }}>
            <FormControlLabel control={<Checkbox checked={checkstates[0]} onChange={(e) => handleChange(e, 0)} />} label="Average" /> {/* Sorry I just really don't want the emoji in the label */}
            <FormControlLabel control={<Checkbox checked={checkstates[1]} onChange={(e) => handleChange(e, 1)} />} label={checkbox_labels[1]} />
            <FormControlLabel control={<Checkbox checked={checkstates[2]} onChange={(e) => handleChange(e, 2)} />} label={checkbox_labels[2]} />
            <FormControlLabel control={<Checkbox checked={checkstates[3]} onChange={(e) => handleChange(e, 3)} />} label="MATH" />
            <FormControlLabel control={<Checkbox checked={checkstates[4]} onChange={(e) => handleChange(e, 4)} />} label={checkbox_labels[4]} />
            <FormControlLabel control={<Checkbox checked={checkstates[5]} onChange={(e) => handleChange(e, 5)} />} label={checkbox_labels[5]} />
            <FormControlLabel control={<Checkbox checked={checkstates[6]} onChange={(e) => handleChange(e, 6)} />} label={checkbox_labels[6]} />
          </FormGroup>

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
          <Tooltip
            formatter={(value, name) => [value, keyMapping[name]]}
            labelFormatter={(label) => `Model: ${label}`}
          />
          {checkstates[0] ? <Bar dataKey="average" fill="#ee6699" LabelList={{ dataKey: "average", position: "top" }} /> : null}
          {checkstates[1] ? <Bar dataKey="moe" fill="#aa8888" LabelList={{ dataKey: "moe", position: "top" }} /> : null}
          {checkstates[2] ? <Bar dataKey="bbh" fill="#88aa88" LabelList={{ dataKey: "bbh", position: "top" }} /> : null}
          {checkstates[3] ? <Bar dataKey="mth" fill="#8888aa" LabelList={{ dataKey: "mth", position: "top" }} /> : null}
          {checkstates[4] ? <Bar dataKey="gpqa" fill="#999999" LabelList={{ dataKey: "gpqa", position: "top" }} /> : null}
          {checkstates[5] ? <Bar dataKey="musr" fill="#555555" LabelList={{ dataKey: "musr", position: "top" }} /> : null}
          {checkstates[6] ? <Bar dataKey="mmlupro" fill="#7120ab" LabelList={{ dataKey: "mmlupro", position: "top" }} /> : null}
        </BarChart>
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

      {selectedModels.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: 32, backgroundColor: "#1e1e1e", color: "white" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white" }}><strong>Feature</strong></TableCell>
                {selectedModels.map((modelName) => (
                  <TableCell key={modelName} style={{ color: "white" }}>
                    <strong>{modelName}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                let currentSection = "";

                return featureMap.map((feature, idx) => {
                  if (feature.type === "section") {
                    currentSection = feature.label;
                    return (
                      <TableRow key={"section-" + idx}>
                        <TableCell
                          colSpan={selectedModels.length + 1}
                          style={{
                            backgroundColor: "#2D3748",
                            color: "#ffffff",
                            fontWeight: "bold",
                            fontSize: "16px"
                          }}
                        >
                          {feature.label}
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return (
                    <TableRow key={feature.label}>
                      <TableCell style={{ color: "white" }}>{feature.label}</TableCell>
                      {selectedModels.map((modelName) => {
                        const model = data.find((d) => d.fullname === modelName);
                        const value = model?.[feature.key];

                        const isPerformance = currentSection === "📊 Performance (0 - 100)";

                        return (
                          <TableCell key={modelName + feature.label} style={{ color: "#e0e0e0" }}>
                            {isPerformance ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{
                                  flexGrow: 1,
                                  height: "8px",
                                  backgroundColor: "#2D3748",
                                  borderRadius: "4px",
                                  overflow: "hidden"
                                }}>
                                  <div style={{
                                    width: `${Math.min(100, value).toFixed(0)}%`,
                                    height: "100%",
                                    backgroundColor: "#90cdf4"
                                  }} />
                                </div>
                                <span style={{ minWidth: "40px", textAlign: "right" }}>
                                  {feature.transform ? feature.transform(value) : value}
                                </span>
                              </div>
                            ) : feature.isHTML ? (
                              <span dangerouslySetInnerHTML={{ __html: value }} />
                            ) : (
                              feature.transform ? feature.transform(value) : String(value)
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                });
              })()}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
