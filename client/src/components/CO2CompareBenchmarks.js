import { useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from 'react-select';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Autocomplete, TextField, Box, Stack, FormControl, InputLabel, MenuItem, Typography
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
  const [infoDialogOpen, setInfoDialogOpen] = useState(null);
  const [tempValue, setTempValue] = useState(null);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [modelToRemove, setModelToRemove] = useState(null);

  const removeModel = (model) => {
    setSelectedModels(selectedModels.filter((m) => m !== model));
  };

  // Checkbox states. Fills it with an array of length checkbox_labels so if we add more please add it there.
  const [checkstates, checkboxStates] = useState(Array(checkbox_labels.length + 1).fill(false));

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
    const co2     = modelData ? parseFloat(modelData["CO₂ cost (kg)"]).toFixed(2) : 0;
    const average = modelData ? parseFloat(modelData[checkbox_labels[0]]).toFixed(2) : 0;
    const moe     = modelData ? parseFloat(modelData[checkbox_labels[1]]).toFixed(2) : 0;
    const bbh     = modelData ? parseFloat(modelData[checkbox_labels[2]]).toFixed(2) : 0;
    const mth     = modelData ? parseFloat(modelData[checkbox_labels[3]]).toFixed(2) : 0;
    const gpqa    = modelData ? parseFloat(modelData[checkbox_labels[4]]).toFixed(2) : 0;
    const musr    = modelData ? parseFloat(modelData[checkbox_labels[5]]).toFixed(2) : 0;
    const mmlupro = modelData ? parseFloat(modelData[checkbox_labels[6]]).toFixed(2) : 0;

    return {
      name: model,
      co2: co2,
      performance: modelData ? parseFloat(modelData["Average ⬆️"]).toFixed(2) : null,
      chat_template: modelData["Chat Template"] ? "Yes" : "No",
      energy_rating: "Placeholder",
      average: checkstates[checkbox_labels.length] ? (average / co2).toFixed(2) : average,
      moe:     checkstates[checkbox_labels.length] ? (moe / co2).toFixed(2)     : moe,
      bbh:     checkstates[checkbox_labels.length] ? (bbh / co2).toFixed(2)     : bbh,
      mth:     checkstates[checkbox_labels.length] ? (mth / co2).toFixed(2)     : mth,
      gpqa:    checkstates[checkbox_labels.length] ? (gpqa / co2).toFixed(2)    : gpqa,
      musr:    checkstates[checkbox_labels.length] ? (musr / co2).toFixed(2)    : musr,
      mmlupro: checkstates[checkbox_labels.length] ? (mmlupro / co2).toFixed(2) : mmlupro
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
  
    var setavg = true;

    // Basically this little snippet checks if anything is checked, and if nothing is checked just yet we default to turning on average.
    for (var i = 0; i < checkbox_labels.length; i++) {
      if (checkstates[i] == true) {
        setavg = false;
        break;
      }
    }

    if (setavg) {
      checkstates[0] = true;
    }
    
    setSelectedModels([...selectedModels, modelName]);
    setTempValue(null);
  }

  const equivalents = selectedModel ? getCO2Equivalents(selectedModel.co2) : null;

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2D3748" }}>Compare Model Performance Across Benchmarks </h2>

      <div style={{ marginBottom: "16px" }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
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
        <div style={{ width: "100%" }}>

          <FormGroup style={{ display: "inline-block" }}>
            <FormControlLabel control={<Checkbox checked={checkstates[0]} onChange={(e) => handleChange(e, 0)} />} label="Average" /> {/* Sorry I just really don't want the emoji in the label */}
            <FormControlLabel control={<Checkbox checked={checkstates[1]} onChange={(e) => handleChange(e, 1)} />} label={checkbox_labels[1]} />
            <FormControlLabel control={<Checkbox checked={checkstates[2]} onChange={(e) => handleChange(e, 2)} />} label={checkbox_labels[2]} />
            <FormControlLabel control={<Checkbox checked={checkstates[3]} onChange={(e) => handleChange(e, 3)} />} label="MATH" />
            <FormControlLabel control={<Checkbox checked={checkstates[4]} onChange={(e) => handleChange(e, 4)} />} label={checkbox_labels[4]} />
            <FormControlLabel control={<Checkbox checked={checkstates[5]} onChange={(e) => handleChange(e, 5)} />} label={checkbox_labels[5]} />
            <FormControlLabel control={<Checkbox checked={checkstates[6]} onChange={(e) => handleChange(e, 6)} />} label={checkbox_labels[6]} />
            <FormControlLabel control={<Checkbox checked={checkstates[checkbox_labels.length]} onChange={(e) => handleChange(e, checkbox_labels.length)} />} label={"performance per kg CO2"} /> {/* This is a toggle to switch between just the raw performance score to being performance per kg co2. (So kind of like efficiency) */}
          </FormGroup>

        </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis 
              label={{ 
                value: checkstates[checkbox_labels.length] ? 'Performance Score / KG ' : 'Performance Score (%)', 
                angle: -90, 
                position: 'center', 
                dx: -10 
              }}/>
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
            Checks if the model follows directions — like "Respond in bullet points" or "Write as a poem."
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold">🧠 BBH (Big Bench Hard)</Typography>
          <Typography variant="body2" gutterBottom>
            A mix of tough tasks across logic, math, and common sense. It's like a brainy quiz.
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
            These numbers show how much carbon dioxide (CO₂) is released when a model runs. We've also translated that into things we all understand — like car travel or phone charging.
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
            So, if a model emits 25kg of CO₂, that's like driving roughly <strong>100 km</strong> in a typical car.
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
