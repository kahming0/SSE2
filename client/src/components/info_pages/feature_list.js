import React, { useState } from 'react';

export default function FeatureList() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonSymbol = isOpen ? '▼' : '▶';

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div onClick={toggleOpen} style={{width:'100%', cursor:'pointer', paddingLeft: "30px" }} class="HomeBar">
        <button
          style={{ cursor: "pointer", marginRight: "8px", fontSize: "18px", background: "none", border: "none" }}
        >
          {buttonSymbol}
        </button>
        <h2
          style={{ display: "inline-block", fontSize: "24px", fontWeight: "bold", color: "#2D3748", cursor: "pointer", margin:0}}
        >
          Feature list
        </h2>
      </div>
      {isOpen && (
        <div class="dropdownData">
          <p>
            An overview of all the features that you can use on this website:
          </p>

          <div style={{ paddingLeft: "16px" }}>
              <strong>Compare models</strong>   - Compare any chosen models by their CO2 emissions as bar charts, or their performance vs emissions in a scatter plot.  <br/>
              - You can filter by model architecture, range of CO2 emissions, or to only show models with a chat template. <br/>
              - Clicking on any bar chart displays suggested alternatives to that model. <br/>
              - At the bottom of the page additional information can be found. <br/>
              <strong>Compare benchmarks</strong> - Compare any chosen models by their performance in various benchmarks <br />
              - Toggling the performance per kg co2 compares each models performance divided by their emissions. This allows users to pick the models which perform best for the lest co2 cost. <br/>
              - At the bottom of the page additional information can be found. <br/>
              <strong>Top co2 models</strong> - View a list of the top and bottom 10 co2 producing models <br />
              <strong>CO2 vs performance</strong> - View a scatter plot comparing the co2 emissions vs the performance for each model <br />
              - Filters can be applied to only view certain architectures performances.


            </div>

        </div>
      )}
    </div>
  );
}
