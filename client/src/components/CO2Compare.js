import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Autocomplete, TextField, Box, Stack, FormControl, InputLabel, 
  Select, MenuItem, Typography
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart,
  Scatter, CartesianGrid, Legend, Label, LabelList,
} from "recharts";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
  const [tempValue, setTempValue] = useState(null);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(null);

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

  // const handleClick = (data) => {
  //   //navigate (`/model/${encodeURIComponent(data.name)}`);
  //   setSelectedModel(data);
  //   setIsModalOpen(true);
  // };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedModel(null);
  };
  

  const equivalents = selectedModel ? getCO2Equivalents(selectedModel.co2) : null;

  const [modelToRemove, setModelToRemove] = useState(null);

  const featureMap = [
    { label: "🌱 Environmental Impact", type: "section" },
    { label: "CO₂ Cost (kg)", key: "CO₂ cost (kg)", transform: (val) => val?.toFixed(2) },
    { label: "Kms Driven", key: "CO₂ cost (kg)", transform: (val) => ((val / 0.393) * 1.60934).toFixed(0) },
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

  const handleAddModel = (modelName) => {
    if (!modelName) return;

    if (selectedModels.length >= 5) {
      setLimitDialogOpen(true);
      return;
    }

    if (selectedModels.includes(modelName)) {
      setDuplicateDialogOpen(true);
      return;
    }
  
    setSelectedModels([...selectedModels, modelName]);
    setTempValue(null);
  }
  
  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2D3748" }}>Compare CO₂ Costs</h2>

      <div style={{ marginBottom: "16px" }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="mode-select-label">Graph mode</InputLabel>
              <Select
                labelId="mode-select-label"
                value={mode}
                label="Graph Mode"
                onChange={handleModeChange}
              >
                {Object.values(MODES).map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              options={
                data.map((item) => item.fullname)
                .filter((name) => !selectedModels.includes(name))
              }
              value={tempValue}
              onChange={(event, newValue) => setTempValue(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Search HuggingFace model" size="small" />
              )}
              sx={{ minWidth: 250 }}
            />

            <Button
              variant="contained"
              onClick={() => handleAddModel(tempValue)}
              disabled={!tempValue}
              size="small"
            >
              Add Model To Compare
            </Button>
            <Typography variant="caption" sx={{ color: selectedModels.length >= 5 ? 'error.main' : 'text.secondary' }}>
              {selectedModels.length} / 5 models selected
            </Typography>
          </Stack>

          <Dialog open={limitDialogOpen} onClose={() => setLimitDialogOpen(false)}>
            <DialogTitle>Limit Reached</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You can only compare up to 5 models at a time.
                Please remove a model to add a new one.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setLimitDialogOpen(false)} autoFocus>
                Got it
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={duplicateDialogOpen} onClose={() => setDuplicateDialogOpen(false)}>
            <DialogTitle>Model Already Selected</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This model is already added to the comparison. Please select a different model.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDuplicateDialogOpen(false)} autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
        <label style={{ marginRight: "8px", fontWeight: "500" }}>Selected models:</label>
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
              onClick={() => setModelToRemove(model)}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #E2E8F0",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "12px",
                cursor: "pointer",
                color: "#E53E3E"
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <Dialog open={!!modelToRemove} onClose={() => setModelToRemove(null)}>
        <DialogTitle>Remove Model</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove <strong>{modelToRemove}</strong> from the comparison?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModelToRemove(null)}>Cancel</Button>
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

      <ResponsiveContainer width="100%" height={300}>
        { mode === MODES.CO2 ? (
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis 
              label={{ 
                value: 'CO₂ Emissions (kg)', 
                angle: -90, 
                position: 'center', 
                offset: 10 
              }} 
            />
            <Tooltip
            formatter={(value, name) => {
              const formattedValue = value;
              return [formattedValue, name === "co2" ? "CO₂ (kg)" : "Performance"];
            }}
            labelFormatter={(label) => `Model: ${label}`} />
			{<Bar dataKey="co2"     fill="#8884d8" LabelList={{dataKey:"co2", position:"top"}} />}
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
              <Scatter name="Models" data={chartData} fill="#3182CE">
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
                          <Box display="flex" alignItems="center" gap={1}>
                            <span>{feature.label}</span>
                            {feature.label.includes("Environmental Impact") && (
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{ color: 'white', borderColor: 'white', textTransform: 'none', padding: '2px 8px' }}
                                onClick={() => setInfoDialogOpen("environment")}
                              >
                                What does this mean?
                              </Button>
                            )}
                            {feature.label.includes("Performance") && (
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{ color: 'white', borderColor: 'white', textTransform: 'none', padding: '2px 8px' }}
                                onClick={() => setInfoDialogOpen("performance")}
                              >
                                What does this mean?
                              </Button>
                            )}
                          </Box>
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

      <Dialog open={infoDialogOpen === 'performance'} onClose={() => setInfoDialogOpen(null)} maxWidth="sm" fullWidth>
        <DialogTitle>🔍 Understanding Performance Scores</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom>
            These scores help you compare how well a model understands and completes different types of tasks. Here's what each benchmark means:
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold">📊 Average Score</Typography>
          <Typography variant="body2" gutterBottom>
            A combined score across all test categories, like an overall GPA for the model. It balances performance from all benchmarks.
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold">📋 IFEval (Instruction Following)</Typography>
          <Typography variant="body2" gutterBottom>
            Checks if the model follows directions — like “Respond in bullet points” or “Write as a poem.”
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold">🧠 BBH (Big Bench Hard)</Typography>
          <Typography variant="body2" gutterBottom>
            A mix of tough tasks across logic, math, and common sense. It’s like a brainy quiz.
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold">🧮 MATH (Level 5)</Typography>
          <Typography variant="body2" gutterBottom>
            Solving high-school level math problems — think geometry and algebra.
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold">🔬 GPQA</Typography>
          <Typography variant="body2" gutterBottom>
            Tough science trivia at the PhD level — biology, chemistry, physics questions.
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold">🧵 MuSR</Typography>
          <Typography variant="body2" gutterBottom>
            Tests if the model can read and understand long texts while reasoning across them.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              📚 Sources:
            </Typography>

            <ul style={{ paddingLeft: 20, marginTop: 4 }}>
              <li>
                <a
                  href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#90cdf4', textDecoration: 'underline' }}
                >
                  EPA Greenhouse Gas Equivalencies Calculator
                </a>
              </li>
              <li>
                <a
                  href="https://huggingface.co/docs/leaderboards/open_llm_leaderboard/emissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#90cdf4', textDecoration: 'underline' }}
                >
                  Hugging Face CO₂ Emissions Methodology
                </a>
              </li>
              <li>
                <a
                  href="https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard#/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#90cdf4', textDecoration: 'underline' }}
                >
                  Open LLM Leaderboard
                </a>
              </li>
            </ul>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(null)}>Close</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={infoDialogOpen === 'environment'} onClose={() => setInfoDialogOpen(null)} maxWidth="sm" fullWidth>
        <DialogTitle>🌱 Understanding The Environmental Impact</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}> 🌍 CO₂ Emissions</Typography>
          <Typography variant="body1" gutterBottom>
            These numbers show how much carbon dioxide (CO₂) is released when a model runs. We’ve also translated that into things we all understand — like car travel or phone charging.
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>🚗 Kilometers Driven</Typography>
          <Typography variant="body2" gutterBottom>
            This shows the equivalent CO₂ emissions as if you drove a typical gas-powered car that:
          </Typography>
          <ul style={{ paddingLeft: "1.5rem" }}>
            <li>Gets about <strong>22.8 miles per gallon</strong></li>
            <li>Includes most cars, SUVs, pickups, and vans</li>
            <li>Accounts for tailpipe and greenhouse gas emissions</li>
          </ul>
          <Typography variant="body2" gutterBottom>
            So, if a model emits 25kg of CO₂, that’s like driving roughly <strong>100 km</strong> in a typical car.
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>📱 Smartphones Charged</Typography>
          <Typography variant="body2" gutterBottom>
            This is how many smartphones you could fully charge with the same amount of energy the model uses.
          </Typography>
          <ul style={{ paddingLeft: "1.5rem" }}>
            <li>Includes charging + keeping your phone topped up for a whole day</li>
            <li>Based on U.S. national electricity mix in 2022</li>
            <li>Accounts for power lost during transmission</li>
          </ul>
          <Typography variant="body2">
            Example: 1 kg of CO₂ is roughly equal to charging <strong>80 smartphones</strong>.
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>💡 Why this matters</Typography>
          <Typography variant="body2">
            AI models can use a lot of power. Showing CO₂ in everyday terms helps you choose models that balance performance with sustainability.
          </Typography>
          <Typography variant="caption" sx={{ mt: 3 }}>
            📘 Source:&nbsp;
            <a
              href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#90cdf4', textDecoration: 'underline' }}
            >
              EPA Greenhouse Gas Equivalencies Calculator
            </a>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
