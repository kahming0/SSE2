import React, { useState } from 'react';

export default function CO2Calculation() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonSymbol = isOpen ? '▼' : '▶';

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        style={{ cursor: "pointer", marginRight: "8px", fontSize: "18px", background: "none", border: "none" }}
        onClick={toggleOpen}
      >
        {buttonSymbol}
      </button>
      <h2
        style={{ display: "inline-block", fontSize: "24px", fontWeight: "bold", color: "#2D3748", cursor: "pointer" }}
        onClick={toggleOpen}
      >
        CO₂ Calculations
      </h2>
      {isOpen && (
        <div style={{ marginTop: "8px" }}>
          <p>Hugging Face uses the following function to estimate the CO₂ emissions:</p>

            <div style={{ paddingLeft: "16px" }}>
              <strong>C(M) = P × T × E</strong> <br /><br />
              <strong>where:</strong> <br />
              - <strong>C</strong> = CO₂ cost in kg <br />
              - <strong>M</strong> = AI model being analyzed <br />
              - <strong>P</strong> = Power consumption per hour (kW) <br />
              - <strong>T</strong> = Total time the model runs (hours) <br />
              - <strong>E</strong> = Energy source emissions factor (kg CO₂ per kWh) <br />
            </div>
        
          <p>The function assumes the workload is running on 8 NVIDIA H100 SXM GPUs in Northern Virginia.</p>
          <a href="https://huggingface.co/docs/leaderboards/open_llm_leaderboard/emissions" target="_blank" rel="noopener noreferrer">
            Click here for more information on Hugging Face's CO₂ calculations.
          </a>
        </div>
      )}
    </div>
  );
}
