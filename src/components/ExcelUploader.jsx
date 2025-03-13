import * as XLSX from "xlsx";
import { useState } from "react";

const ExcelUploader = ({ onDataProcessed }) => {
  const [fileName, setFileName] = useState("");

  const sedeMap = {
    "ENGA": "ENGATIVA",
    "ENGATIVA": "ENGATIVA",
    "EMAUS": "CAMI EMAUS",
    "CAMI EMAUS": "CAMI EMAUS",
    "SIMON BOLIVAR": "SIMÓN BOLÍVAR",
    "SIMÓN BOLIVAR": "SIMÓN BOLÍVAR",
  };

  const cleanName = (name) => {
    return sedeMap[name?.trim().toUpperCase()] || name?.trim() || "Desconocido";
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      if (workbook.SheetNames.length === 0) {
        console.error("El archivo no contiene hojas.");
        return;
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      let jsonData = XLSX.utils.sheet_to_json(worksheet);
      if (!jsonData.length) {
        console.error("La hoja está vacía o no se pudo leer.");
        return;
      }

      jsonData = jsonData
        .filter((row) => row["MODALIDAD"]?.trim() === "RECIBE")
        .map((row) => ({
          "CODIGO SERVICIO": row["CODIGO SERVICIO"],
          "FECHA REGISTRO": row["FECHA REGISTRO"]
            ? new Date((row["FECHA REGISTRO"] - 25569) * 86400 * 1000)
                .toISOString()
                .split("T")[0]
            : "Fecha no disponible",
          "NOMBRE SEDE": cleanName(row["NOMBRE SEDE"]),
        }));

      const report = {};
      jsonData.forEach(({ "NOMBRE SEDE": sede }) => {
        report[sede] = (report[sede] || 0) + 1;
      });

      const reportData = Object.entries(report).map(([sede, total]) => ({
        "NOMBRE SEDE": sede,
        "TOTAL SERVICIOS": total,
      }));

      onDataProcessed(reportData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
      />
      {fileName && <p className="mt-2 text-gray-700 font-semibold">📂 {fileName}</p>}
    </div>
  );
};

export default ExcelUploader;
