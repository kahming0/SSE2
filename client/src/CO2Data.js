import data from "./konbert-output-323e23e4.json"

export default function Co2Table() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">CO₂ Cost by Model</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-lg font-medium">Model</th>
              <th className="px-6 py-3 text-left text-lg font-medium">CO₂ Cost (kg)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`border-t text-gray-800 ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition`}
              >
                <td className="px-6 py-3 text-left font-medium">{item.fullname}</td>
                <td className="px-6 py-3 text-left">{item["CO₂ cost (kg)"].toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
