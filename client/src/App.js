import './App.css';
import CO2Calculation from "./components/CO2Calculation.js";
import CO2Compare from "./components/CO2Compare.js";
import TopCO2BarChart from './components/TopCO2.js';

function App() {
  return (
    <div style={{ padding: "12px" }}>
      <h1 className="text-2xl font-bold mb-4">Hugging Face Model Carbon Tool</h1>
      <h2 className="text-xl mb-2">Explore and compare the CO₂ costs of Hugging Face's models</h2>
      <CO2Calculation/>
      <CO2Compare/>
      <TopCO2BarChart/>
    </div>
  );
}

export default App;
