import { useState } from "react";
import ExcelUploader from "./components/ExcelUploader";

function App() {
  const [data, setData] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Generador de Reportes</h1>
      <ExcelUploader onDataProcessed={setData} />

      {data.length > 0 && (
        <div className="mt-8 w-full max-w-4xl bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">📌 Reporte de Servicios</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-300 px-6 py-3 text-left">🏢 Nombre Sede</th>
                  <th className="border border-gray-300 px-6 py-3 text-left">📊 Total de Servicios</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className="bg-white even:bg-gray-100 hover:bg-gray-200 transition">
                    <td className="border border-gray-300 px-6 py-2">{row["NOMBRE SEDE"]}</td>
                    <td className="border border-gray-300 px-6 py-2 font-bold text-blue-600">
                      {row["TOTAL SERVICIOS"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
