import { useParams } from "react-router-dom";
import data from "../konbert-output-323e23e4.json";

export default function ModelDetails() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const model = data.find((item) => item.fullname === decodedName);

  if (!model) {
    return <p>Model not found.</p>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2 className="text-xl font-bold mb-4">{model.fullname}</h2>
      <ul className="space-y-2">
        <li><strong>Submission date:</strong> {model["Submission Date"]}</li>
        <li><strong>CO₂ Cost (kg):</strong> {model["CO₂ cost (kg)"]}</li>
        <li><strong>Performance:</strong> {model["Average ⬆️"]}</li>
        <li>
            <strong>Chat Template:</strong> {model["Chat Template"] ? "Yes" : "No"}
        </li>
        <li><strong>Energy Efficiency Rating:</strong> A (Placeholder)</li>
      </ul>
    </div>
  );
}