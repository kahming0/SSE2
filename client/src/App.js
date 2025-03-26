import './App.css';
import CO2Compare from "./components/CO2Compare.js";
import TopCO2BarChart from './components/TopCO2.js';
import CO2vsPerformance from './components/CO2vsPerformance.js';
import ModelDetails from './components/ModelDetails';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { asyncBufferFromUrl, parquetReadObjects } from 'hyparquet';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'https://huggingface.co/datasets/open-llm-leaderboard/contents/resolve/main/data/train-00000-of-00001.parquet'
        const file = await asyncBufferFromUrl({ url }) // wrap url for async fetching
        const parsedData = await parquetReadObjects({file})
        setData(parsedData);
      } catch (error) {
        console.error("Error fetching Parquet data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">CO₂ Cost Data Viewer</h1>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <CO2Compare data={data} />
                <TopCO2BarChart data={data} />
                <CO2vsPerformance data={data} />
              </>
            }
          />
          <Route path="/model/:name" element={<ModelDetails data={data} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
