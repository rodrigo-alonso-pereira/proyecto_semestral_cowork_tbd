import api from "./api";

// ---------- NUEVOS CLIENTES ----------

// KPI mensual: nuevos clientes de un mes específico (yyyy-MM)
export const getKpiNuevosClientesMes = (yearMonth) =>
  api.get(`/kpi/nuevos-clientes/mes/${yearMonth}`);

// KPI anual: nuevos clientes de todos los meses del año
export const getKpiNuevosClientesAnio = (year) =>
  api.get(`/kpi/nuevos-clientes/anio/${year}`);


// ---------- UTILIZACIÓN REAL DE RECURSOS ----------

// KPI mensual: utilización real de un mes específico (yyyy-MM)
export const getKpiUtilizacionMes = (yearMonth) =>
  api.get(`/kpi/utilizacion-real/mes/${yearMonth}`);

// KPI anual: utilización real de todos los meses del año
export const getKpiUtilizacionAnio = (year) =>
  api.get(`/kpi/utilizacion-real/anio/${year}`);


// ---------- CHURN RATE ----------

// KPI mensual: tasa de churn de un mes específico (yyyy-MM)
export const getKpiChurnMes = (yearMonth) =>
  api.get(`/kpi/churn-rate/mes/${yearMonth}`);

// KPI anual: churn de todos los meses del año
export const getKpiChurnAnio = (year) =>
  api.get(`/kpi/churn-rate/anio/${year}`);
