import './App.css';
import CO2Data from "./CO2Data"; // Adjust the path if needed

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CO₂ Cost Data Viewer</h1>
      <CO2Data />
    </div>
  );
}

export default App;
