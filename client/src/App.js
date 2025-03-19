import './App.css';
import CO2Compare from "./components/CO2Compare.js";
import TopCO2BarChart from './components/TopCO2.js';
import CO2vsPerformance from './components/CO2vsPerformance.js';
import ModelDetails from './components/ModelDetails';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">CO₂ Cost Data Viewer</h1>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <CO2Compare />
                <TopCO2BarChart />
                <CO2vsPerformance />
              </>
            }
          />
          <Route path="/model/:name" element={<ModelDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
