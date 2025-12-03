// src/pages/DashboardAdmin.js
import React, { useMemo, useState } from "react";
import { Card, Row, Col, Badge, Form } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
} from "recharts";

// ===========================
// Datos Pruebas (12 meses, 1 año)
// ===========================
const dataKpiMensual = [
  // anio, mesNum (1..12), etiqueta mes, y todos los KPI
  { anio: 2025, mesNum: 1, mes: "Ene", nuevos: 8, horasReservadas: 320, horasPosibles: 480, porcentaje: 66.7, clientesSeFueron: 5, activosInicio: 180, churn: 2.8 },
  { anio: 2025, mesNum: 2, mes: "Feb", nuevos: 12, horasReservadas: 410, horasPosibles: 480, porcentaje: 85.4, clientesSeFueron: 7, activosInicio: 190, churn: 3.7 },
  { anio: 2025, mesNum: 3, mes: "Mar", nuevos: 15, horasReservadas: 280, horasPosibles: 480, porcentaje: 58.3, clientesSeFueron: 4, activosInicio: 195, churn: 2.1 },
  { anio: 2025, mesNum: 4, mes: "Abr", nuevos: 11, horasReservadas: 360, horasPosibles: 480, porcentaje: 75.0, clientesSeFueron: 6, activosInicio: 200, churn: 3.0 },
  { anio: 2025, mesNum: 5, mes: "May", nuevos: 16, horasReservadas: 390, horasPosibles: 480, porcentaje: 81.3, clientesSeFueron: 3, activosInicio: 205, churn: 1.5 },
  { anio: 2025, mesNum: 6, mes: "Jun", nuevos: 20, horasReservadas: 420, horasPosibles: 480, porcentaje: 87.5, clientesSeFueron: 4, activosInicio: 210, churn: 1.9 },
  { anio: 2025, mesNum: 7, mes: "Jul", nuevos: 18, horasReservadas: 350, horasPosibles: 480, porcentaje: 72.9, clientesSeFueron: 5, activosInicio: 215, churn: 2.3 },
  { anio: 2025, mesNum: 8, mes: "Ago", nuevos: 14, horasReservadas: 330, horasPosibles: 480, porcentaje: 68.8, clientesSeFueron: 6, activosInicio: 220, churn: 2.7 },
  { anio: 2025, mesNum: 9, mes: "Sep", nuevos: 17, horasReservadas: 360, horasPosibles: 480, porcentaje: 75.0, clientesSeFueron: 4, activosInicio: 225, churn: 1.8 },
  { anio: 2025, mesNum: 10, mes: "Oct", nuevos: 19, horasReservadas: 400, horasPosibles: 480, porcentaje: 83.3, clientesSeFueron: 7, activosInicio: 230, churn: 3.0 },
  { anio: 2025, mesNum: 11, mes: "Nov", nuevos: 13, horasReservadas: 370, horasPosibles: 480, porcentaje: 77.1, clientesSeFueron: 5, activosInicio: 235, churn: 2.1 },
  { anio: 2025, mesNum: 12, mes: "Dic", nuevos: 22, horasReservadas: 440, horasPosibles: 480, porcentaje: 91.7, clientesSeFueron: 6, activosInicio: 240, churn: 2.5 },
];

// Meses para el select
const MESES = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

// Años disponibles en base al dataset
const AÑOS_DISPONIBLES = Array.from(
  new Set(dataKpiMensual.map((d) => d.anio))
).sort((a, b) => a - b);

// Valores por defecto = último registro
const ultimoRegistro = dataKpiMensual[dataKpiMensual.length - 1];
const DEFAULT_ANIO = ultimoRegistro.anio;
const DEFAULT_MES = ultimoRegistro.mesNum;

export default function DashboardAdmin() {
  // Filtros superiores (solo KPIs)
  const [filtrosKpi, setFiltrosKpi] = useState({
    mes: DEFAULT_MES,
    anio: DEFAULT_ANIO,
  });

  // Filtro inferior (año de todos los gráficos)
  const [anioGraficos, setAnioGraficos] = useState(DEFAULT_ANIO);


  // Registro mensual para los KPIs (mes + año seleccionados arriba)
  const registroKpi = useMemo(() => {
    return (
      dataKpiMensual.find(
        (d) => d.anio === filtrosKpi.anio && d.mesNum === filtrosKpi.mes
      ) || ultimoRegistro
    );
  }, [filtrosKpi]);

  const kpiNuevosMesActual = registroKpi.nuevos;
  const kpiUtilizacionMesActual = registroKpi.porcentaje;
  const kpiChurnActual = {
    churn: registroKpi.churn,
    clientesSeFueron: registroKpi.clientesSeFueron,
    activosInicio: registroKpi.activosInicio,
  };

  // Datos del año seleccionado para los gráficos
  const datosAnio = useMemo(
    () => dataKpiMensual.filter((d) => d.anio === anioGraficos),
    [anioGraficos]
  );

  const primerSemestre = datosAnio.filter((d) => d.mesNum >= 1 && d.mesNum <= 6);
  const segundoSemestre = datosAnio.filter(
    (d) => d.mesNum >= 7 && d.mesNum <= 12
  );

  const handleFiltroKpiChange = (e) => {
    const { name, value } = e.target;
    setFiltrosKpi((f) => ({
      ...f,
      [name]: Number(value),
    }));
  };

  const handleAnioGraficosChange = (e) => {
    setAnioGraficos(Number(e.target.value));
  };

  return (
    <div className="container mt-4">
      <h2>Dashboard administrativo</h2>

      {/* Filtros superiores (solo tarjetas KPI) */}
      <Row className="mt-3 g-3">
        <Col xs={12} md={3}>
          <Form.Group>
            <Form.Label>Mes (tarjetas)</Form.Label>
            <Form.Select
              name="mes"
              value={filtrosKpi.mes}
              onChange={handleFiltroKpiChange}
            >
              {MESES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={12} md={3}>
          <Form.Group>
            <Form.Label>Año (tarjetas)</Form.Label>
            <Form.Select
              name="anio"
              value={filtrosKpi.anio}
              onChange={handleFiltroKpiChange}
            >
              {AÑOS_DISPONIBLES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Fila de KPIs */}
      <Row className="mt-3 g-3">
        {/* KPI Nuevos clientes */}
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h6 className="text-muted mb-1">
              Nuevos clientes (mes actual)
            </h6>
            <h3 className="mb-2">{kpiNuevosMesActual}</h3>
            <small className="text-muted">
              Basado en la fecha de primer estado “Activo”.
            </small>
          </Card>
        </Col>

        {/* KPI Utilización recursos */}
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h6 className="text-muted mb-1">
              Utilización de recursos (mes actual)
            </h6>
            <h3 className="mb-2">{kpiUtilizacionMesActual}%</h3>
            <small className="text-muted">
              Horas reservadas / horas posibles (lunes a viernes).
            </small>
          </Card>
        </Col>

        {/* KPI Churn */}
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h6 className="text-muted mb-1">
              Churn rate (mes actual)
            </h6>
            <h3 className="mb-2">{kpiChurnActual.churn}%</h3>
            <small className="text-muted d-block mb-2">
              Clientes que se fueron:{" "}
              <strong>{kpiChurnActual.clientesSeFueron}</strong> / Activos
              inicio: <strong>{kpiChurnActual.activosInicio}</strong>
            </small>
            <Badge bg={kpiChurnActual.churn > 3 ? "danger" : "success"}>
              {kpiChurnActual.churn > 3 ? "Atención" : "Saludable"}
            </Badge>
          </Card>
        </Col>
      </Row>

      {/* Filtro inferior */}
      <Row className="mt-4 mb-2">
        <Col xs={12} md={3}>
          <Form.Group>
            <Form.Label>Año (gráficos)</Form.Label>
            <Form.Select
              value={anioGraficos}
              onChange={handleAnioGraficosChange}
            >
              {AÑOS_DISPONIBLES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Fila 2: Ene-Jun (Nuevos clientes / Utilización) */}
      <Row className="mt-2 g-3">
        {/* Nuevos clientes Ene-Jun */}
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h5 className="mb-3">
              Nuevos clientes (Enero - Junio {anioGraficos})
            </h5>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={primerSemestre}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="nuevos" name="Nuevos clientes" fill="#198754" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Utilización Ene-Jun */}
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h5 className="mb-3">
              Utilización de recursos (Enero - Junio {anioGraficos})
            </h5>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <ComposedChart data={primerSemestre}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis yAxisId="left" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="horasReservadas"
                    name="Horas reservadas"
                    fill="#0d6efd"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="horasPosibles"
                    name="Horas posibles"
                    fill="#6c757d"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="porcentaje"
                    name="% Utilización"
                    stroke="#20c997"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4 g-3">
        {/* Nuevos clientes Jul-Dic */}
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h5 className="mb-3">
              Nuevos clientes (Julio - Diciembre {anioGraficos})
            </h5>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={segundoSemestre}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="nuevos" name="Nuevos clientes" fill="#198754" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Utilización Jul-Dic */}
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h5 className="mb-3">
              Utilización de recursos (Julio - Diciembre {anioGraficos})
            </h5>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <ComposedChart data={segundoSemestre}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis yAxisId="left" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="horasReservadas"
                    name="Horas reservadas"
                    fill="#11664cff"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="horasPosibles"
                    name="Horas posibles"
                    fill="#8cb68eff"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="porcentaje"
                    name="% Utilización"
                    stroke="#d16e34ff"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Churn anual */}
      <Row className="mt-4 g-3">
        <Col md={12}>
          <Card className="p-3 shadow-sm">
            <h5 className="mb-3">
              Churn rate por mes (Enero - Diciembre {anioGraficos})
            </h5>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={datosAnio}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis
                    domain={[0, "auto"]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(value, name) =>
                      name === "churn"
                        ? [`${value}%`, "Churn"]
                        : [value, name]
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="churn"
                    name="Churn %"
                    stroke="#d16e34ff"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
