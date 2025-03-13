const sedeMap = {
  "ENGA": "ENGATIVA",
  "EMAUS": "CAMI EMAUS",
  "CAMI EMAUS": "CAMI EMAUS"
};

export const processExcelData = (data) => {
  return data.reduce((acc, row) => {
    if (row["Modalidad"] !== "Recibe") return acc;

    const sede = sedeMap[row["Nombre Sede"]] || row["Nombre Sede"];
    const mes = new Date(row["Fecha Registro"]).toLocaleString("es-CO", { month: "long" });

    const key = `${sede}_${mes}`;
    if (!acc[key]) {
      acc[key] = {
        codigoServicio: row["Código Servicio"],
        nombreSede: sede,
        mes,
        total: 0
      };
    }
    acc[key].total += 1;
    
    return acc;
  }, {});
};
