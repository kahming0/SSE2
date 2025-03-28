import './App.css';
import CO2Compare from "./components/CO2Compare.js";
import TopCO2BarChart from './components/TopCO2.js';
import CO2vsPerformance from './components/CO2vsPerformance.js';
import ModelDetails from './components/ModelDetails';
import CO2CompareBenchmarks from './components/CO2CompareBenchmarks.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { asyncBufferFromUrl, parquetReadObjects } from 'hyparquet';
import { Tabs, Tab, Box } from '@mui/material';

function App() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

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
    <Router basename="/SSE2">
      <Box sx={{ width: '100%', padding: 2 }}>
        <h1 className="text-2xl font-bold mb-4">Hugging Face Model Carbon Tool</h1>
        <h2 className="text-xl mb-4">Explore and compare the CO₂ costs of Hugging Face's models</h2>

        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="CO2 Tabs">
          <Tab label="Compare Models" />
          <Tab label="Compare Benchmarks" />
          <Tab label="Top CO₂ Models" />
          <Tab label="CO₂ vs Performance" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {tabIndex === 0 && <CO2Compare data={data} />}
          {tabIndex === 1 && <CO2CompareBenchmarks data={data} />}
          {tabIndex === 2 && <TopCO2BarChart data={data} />}
          {tabIndex === 3 && <CO2vsPerformance data={data} /> }
        </Box>
      </Box>
    </Router>
  );
}

export default App;
