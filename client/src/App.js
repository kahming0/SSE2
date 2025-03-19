import './App.css';
import CO2Compare from "./components/CO2Compare.js";
import TopCO2BarChart from './components/TopCO2.js';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CO₂ Cost Data Viewer</h1>
      <CO2Compare />
      <TopCO2BarChart/>
    </div>
  );
}

export default App;
