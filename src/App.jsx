import { useState } from "react";
import ExcelUploader from "./components/ExcelUploader";

function App() {
  const [data, setData] = useState([]);
  const [meses, setMeses] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");

  const handleDataProcessed = (processedData, availableMonths) => {
    setData(processedData);
    setMeses(availableMonths);
  };

  // Filtrar datos según "Tipo de Guía"
  const filteredData = data
    .map((row) => {
      if (!filtroTipo) return row;

      const totalFiltrado = row["TIPO GUIA"][filtroTipo] || 0;
      if (totalFiltrado === 0) return null;

      return {
        ...row,
        "TOTAL SERVICIOS": totalFiltrado,
        meses: Object.fromEntries(
          Object.entries(row.meses)
            .filter(([mes]) => row["TIPO GUIA"][filtroTipo])
        ),
      };
    })
    .filter(Boolean);

  const mesesFiltrados = meses.filter((mes) =>
    filteredData.some((row) => row.meses[mes] > 0)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Generador de Reportes</h1>
      <ExcelUploader onDataProcessed={handleDataProcessed} />

      {data.length > 0 && (
        <>
          <select
            className="mt-4 p-2 border rounded-lg shadow-sm"
            onChange={(e) => setFiltroTipo(e.target.value)}
            value={filtroTipo}
          >
            <option value="">Todos los tipos de guía</option>
            {[...new Set(data.flatMap((row) => Object.keys(row["TIPO GUIA"])))].map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>

          <table className="mt-6 border-collapse border border-gray-300 rounded-lg shadow-sm w-full text-center">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-6 py-3 border-r">🏢 Nombre Sede</th>
                {mesesFiltrados.map((mes) => (
                  <th key={mes} className="px-6 py-3 border-r">{mes}</th>
                ))}
                <th className="px-6 py-3">📊 Total Servicios</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} className="bg-white even:bg-gray-100 hover:bg-gray-200 transition">
                  <td className="px-6 py-2 border-r">{row["NOMBRE SEDE"]}</td>
                  {mesesFiltrados.map((mes) => (
                    <td key={mes} className="px-6 py-2 border-r">{row.meses[mes]}</td>
                  ))}
                  <td className="px-6 py-2 font-bold text-blue-600">{row["TOTAL SERVICIOS"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
