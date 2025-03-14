import * as XLSX from "xlsx";
import { useState } from "react";

const ExcelUploader = ({ onDataProcessed }) => {
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        if (!workbook.SheetNames.length) {
          console.error("El archivo no contiene hojas.");
          return;
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        let jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          console.error("La hoja está vacía o el formato no es válido.");
          return;
        }

        // 🔹 Convertir fechas y filtrar solo "RECIBE"
        jsonData = jsonData
          .filter((row) => row["MODALIDAD"]?.trim() === "RECIBE")
          .map((row) => ({
            "CODIGO SERVICIO": row["CODIGO SERVICIO"],
            "FECHA REGISTRO": row["FECHA REGISTRO"]
              ? new Date((row["FECHA REGISTRO"] - 25569) * 86400 * 1000)
                  .toISOString()
                  .split("T")[0]
              : "Fecha no disponible",
            "NOMBRE SEDE": row["NOMBRE SEDE"]?.trim() || "Desconocido",
            "TIPO GUIA": row["TIPO GUIA"]?.trim() || "Desconocido",
          }));

        const mesesTexto = [
          "enero", "febrero", "marzo", "abril", "mayo", "junio",
          "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];

        // 🔹 Obtener los meses únicos en formato 'MMMM - YYYY'
        const mesesDisponibles = [...new Set(jsonData
          .map(({ "FECHA REGISTRO": fecha }) => fecha !== "Fecha no disponible" ? fecha.substring(0, 7) : null)
          .filter(Boolean))] // Filtra valores nulos
          .sort()
          .map((mes) => {
            const [year, month] = mes.split("-");
            return `${mesesTexto[parseInt(month, 10) - 1]} - ${year}`;
          });

        // 🔹 Inicializar el reporte
        const report = {};
        jsonData.forEach(({ "NOMBRE SEDE": sede, "FECHA REGISTRO": fecha, "TIPO GUIA": tipoGuia }) => {
          if (!report[sede]) {
            report[sede] = {
              "NOMBRE SEDE": sede,
              "TOTAL SERVICIOS": 0,
              "TIPO GUIA": {},
              meses: mesesDisponibles.reduce((acc, mes) => ({ ...acc, [mes]: 0 }), {}),
            };
          }

          if (fecha !== "Fecha no disponible") {
            const [year, month] = fecha.substring(0, 7).split("-");
            const mesTexto = `${mesesTexto[parseInt(month, 10) - 1]} - ${year}`;

            if (report[sede].meses.hasOwnProperty(mesTexto)) {
              report[sede].meses[mesTexto]++;
            } else {
              report[sede].meses[mesTexto] = 1;
            }
          }

          report[sede]["TIPO GUIA"][tipoGuia] = (report[sede]["TIPO GUIA"][tipoGuia] || 0) + 1;
          report[sede]["TOTAL SERVICIOS"] = Object.values(report[sede].meses).reduce((a, b) => a + b, 0);
        });

        // 🔹 Convertir a array y ordenar por nombre de sede
        const reportData = Object.values(report).sort((a, b) => a["NOMBRE SEDE"].localeCompare(b["NOMBRE SEDE"]));

        onDataProcessed(reportData, mesesDisponibles);
      } catch (error) {
        console.error("Error procesando el archivo:", error);
      }
    };
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
      />
      {fileName && <p className="mt-2 text-gray-700 font-semibold">📂 {fileName}</p>}
    </div>
  );
};

export default ExcelUploader;
