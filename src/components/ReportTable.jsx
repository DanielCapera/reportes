import { useState } from "react";

const ReportTable = ({ data }) => {
  const [selectedMonth, setSelectedMonth] = useState("");

  const filteredData = selectedMonth
    ? Object.values(data).filter(item => item.mes === selectedMonth)
    : Object.values(data);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <label className="font-semibold">Filtrar por mes:</label>
        <select
          className="ml-2 border rounded p-1"
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">Todos</option>
          {Array.from(new Set(Object.values(data).map(item => item.mes))).map(mes => (
            <option key={mes} value={mes}>{mes}</option>
          ))}
        </select>
      </div>
      
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Código Servicio</th>
            <th className="border px-4 py-2">Nombre Sede</th>
            <th className="border px-4 py-2">Mes</th>
            <th className="border px-4 py-2">Total de Servicios</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{row.codigoServicio}</td>
              <td className="border px-4 py-2">{row.nombreSede}</td>
              <td className="border px-4 py-2">{row.mes}</td>
              <td className="border px-4 py-2">{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
