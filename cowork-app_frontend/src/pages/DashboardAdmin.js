import React, { useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Badge, Form, Spinner, Alert } from "react-bootstrap";
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

import {
  getKpiNuevosClientesMes,
  getKpiNuevosClientesAnio,
  getKpiUtilizacionMes,
  getKpiUtilizacionAnio,
  getKpiChurnMes,
  getKpiChurnAnio,
} from "../services/kpiService";

const MESES = [
  { value: 1, label: "Enero", short: "Ene" },
  { value: 2, label: "Febrero", short: "Feb" },
  { value: 3, label: "Marzo", short: "Mar" },
  { value: 4, label: "Abril", short: "Abr" },
  { value: 5, label: "Mayo", short: "May" },
  { value: 6, label: "Junio", short: "Jun" },
  { value: 7, label: "Julio", short: "Jul" },
  { value: 8, label: "Agosto", short: "Ago" },
  { value: 9, label: "Septiembre", short: "Sep" },
  { value: 10, label: "Octubre", short: "Oct" },
  { value: 11, label: "Noviembre", short: "Nov" },
  { value: 12, label: "Diciembre", short: "Dic" },
];

const getMonthIndex = (mesValor) => {
  // Soporta "2025-03", "03" o 3
  if (typeof mesValor === "number") return mesValor - 1;
  if (typeof mesValor === "string") {
    const parts = mesValor.split("-");
    const n = Number(parts[1] ?? parts[0]);
    return isNaN(n) ? 0 : n - 1;
  }
  return 0;
};

export default function DashboardAdmin() {
  const hoy = new Date();
  const currentYear = hoy.getFullYear();
  const currentMonth = hoy.getMonth() + 1;

  // ========= FILTROS =========
  // Filtros de arriba → solo afectan las tarjetas
  const [filtrosKpi, setFiltrosKpi] = useState({
    mes: currentMonth,
    anio: currentYear,
  });

  // Filtro de abajo → afecta todos los gráficos
  const [anioGraficos, setAnioGraficos] = useState(currentYear);

  // ========= ESTADO: CARDS =========
  const [kpiMes, setKpiMes] = useState(null);
  const [loadingMes, setLoadingMes] = useState(false);
  const [errorMes, setErrorMes] = useState("");

  // ========= ESTADO: GRÁFICOS (por año) =========
  const [nuevosPorMes, setNuevosPorMes] = useState([]);
  const [utilizacionPorMes, setUtilizacionPorMes] = useState([]);
  const [churnPorMes, setChurnPorMes] = useState([]);
  const [loadingAnio, setLoadingAnio] = useState(false);
  const [errorAnio, setErrorAnio] = useState("");

  const buildYearMonth = (anio, mes) =>
    `${anio}-${String(mes).padStart(2, "0")}`;

  // ========= 1) CARGA PARA TARJETAS (mes / año de arriba) =========
  useEffect(() => {
    const fetchMes = async () => {
      setLoadingMes(true);
      setErrorMes("");

      const { anio, mes } = filtrosKpi;
      const ym = buildYearMonth(anio, mes);

      try {
        const [resNuevos, resUtil, resChurn] = await Promise.all([
          getKpiNuevosClientesMes(ym),
          getKpiUtilizacionMes(ym),
          getKpiChurnMes(ym),
        ]);

        setKpiMes({
          nuevosClientes: resNuevos.data?.nuevosClientes ?? 0,
          horasReservadasTotal: resUtil.data?.horasReservadasTotal ?? 0,
          horasPosibles: resUtil.data?.horasPosibles ?? 0,
          porcentajeUtilizacion: resUtil.data?.porcentajeUtilizacion ?? 0,
          clientesAbandonaron: resChurn.data?.clientesAbandonaron ?? 0,
          clientesActivos: resChurn.data?.clientesActivos ?? 0,
          churnRate: resChurn.data?.churnRate ?? 0,
        });
      } catch (err) {
        console.error("Error al cargar KPIs del mes:", err);
        setErrorMes("No se pudieron cargar los indicadores del mes seleccionado.");
        setKpiMes(null);
      } finally {
        setLoadingMes(false);
      }
    };

    fetchMes();
  }, [filtrosKpi]);

  // ========= 2) CARGA PARA GRÁFICOS (año de abajo) =========
  useEffect(() => {
    const fetchAnio = async () => {
      setLoadingAnio(true);
      setErrorAnio("");

      try {
        const [resNuevos, resUtil, resChurn] = await Promise.all([
          getKpiNuevosClientesAnio(anioGraficos),
          getKpiUtilizacionAnio(anioGraficos),
          getKpiChurnAnio(anioGraficos),
        ]);

        // ---- Nuevos clientes por mes ----
        const nuevos = (resNuevos.data || []).map((item) => {
          const idx = getMonthIndex(item.mes);
          const info = MESES[idx] || { short: "?", value: idx + 1 };
          return {
            mes: info.short,
            mesNum: info.value,
            nuevos: item.nuevosClientes ?? 0,
          };
        });
        // Rellenar meses faltantes
        const completosNuevos = MESES.map((m) => {
          const found = nuevos.find((n) => n.mesNum === m.value);
          return (
            found || {
              mes: m.short,
              mesNum: m.value,
              nuevos: 0,
            }
          );
        });
        setNuevosPorMes(completosNuevos);

        // ---- Utilización por mes ----
        const util = (resUtil.data || []).map((item) => {
          const idx = getMonthIndex(item.mes);
          const info = MESES[idx] || { short: "?", value: idx + 1 };
          return {
            mes: info.short,
            mesNum: info.value,
            horasReservadas: item.horasReservadasTotal ?? 0,
            horasPosibles: item.horasPosibles ?? 0,
            porcentaje: item.porcentajeUtilizacion ?? 0,
          };
        });
        const completosUtil = MESES.map((m) => {
          const found = util.find((u) => u.mesNum === m.value);
          return (
            found || {
              mes: m.short,
              mesNum: m.value,
              horasReservadas: 0,
              horasPosibles: 0,
              porcentaje: 0,
            }
          );
        });
        setUtilizacionPorMes(completosUtil);

        // ---- Churn por mes ----
        const churn = (resChurn.data || []).map((item) => {
          const idx = getMonthIndex(item.mes);
          const info = MESES[idx] || { short: "?", value: idx + 1 };
          return {
            mes: info.short,
            mesNum: info.value,
            clientesSeFueron: item.clientesAbandonaron ?? 0,
            activosInicio: item.clientesActivos ?? 0,
            churn: item.churnRate ?? 0,
          };
        });
        const completosChurn = MESES.map((m) => {
          const found = churn.find((c) => c.mesNum === m.value);
          return (
            found || {
              mes: m.short,
              mesNum: m.value,
              clientesSeFueron: 0,
              activosInicio: 0,
              churn: 0,
            }
          );
        });
        setChurnPorMes(completosChurn);
      } catch (err) {
        console.error("Error al cargar KPIs del año:", err);
        setErrorAnio("No se pudieron cargar los indicadores del año seleccionado.");
        setNuevosPorMes([]);
        setUtilizacionPorMes([]);
        setChurnPorMes([]);
      } finally {
        setLoadingAnio(false);
      }
    };

    fetchAnio();
  }, [anioGraficos]);

  // ========= DERIVADOS (cards y semestres) =========
  const kpiNuevosMesActual = kpiMes?.nuevosClientes ?? 0;
  const kpiUtilizacionMesActual = kpiMes?.porcentajeUtilizacion ?? 0;

  const ultimoChurn = {
    churn: kpiMes?.churnRate ?? 0,
    clientesSeFueron: kpiMes?.clientesAbandonaron ?? 0,
    activosInicio: kpiMes?.clientesActivos ?? 0,
  };

  const nuevosPrimerSemestre = useMemo(
    () => nuevosPorMes.filter((d) => d.mesNum >= 1 && d.mesNum <= 6),
    [nuevosPorMes]
  );
  const nuevosSegundoSemestre = useMemo(
    () => nuevosPorMes.filter((d) => d.mesNum >= 7 && d.mesNum <= 12),
    [nuevosPorMes]
  );

  const utilizacionPrimerSemestre = useMemo(
    () => utilizacionPorMes.filter((d) => d.mesNum >= 1 && d.mesNum <= 6),
    [utilizacionPorMes]
  );
  const utilizacionSegundoSemestre = useMemo(
    () => utilizacionPorMes.filter((d) => d.mesNum >= 7 && d.mesNum <= 12),
    [utilizacionPorMes]
  );

  // ========= HANDLERS FILTROS =========
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

      {/* ===== FILTROS SUPERIORES (MES / AÑO PARA CARDS) ===== */}
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
              <option value={currentYear - 1}>{currentYear - 1}</option>
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear + 1}>{currentYear + 1}</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* ===== FILA DE KPIs (MISMO DISEÑO) ===== */}
      {/* Fila de KPIs (mismo diseño) */}
      <Row className="mt-3 g-3">
        {/* KPI Nuevos clientes */}
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h6 className="text-muted mb-1">Nuevos clientes (mes actual)</h6>
            {loadingMes ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <h3 className="mb-2">{kpiNuevosMesActual}</h3>
            )}
            {errorMes && (
              <small className="text-danger d-block mb-1">{errorMes}</small>
            )}
            <small className="text-muted">
              Basado en la fecha en que se resgitro en la app.
            </small>
          </Card>
        </Col>

        {/* KPI Utilización recursos */}
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h6 className="text-muted mb-1">
              Utilización de recursos (mes actual)
            </h6>
            {loadingMes ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <h3 className="mb-2">{kpiUtilizacionMesActual}%</h3>
            )}
            {errorMes && (
              <small className="text-danger d-block mb-1">{errorMes}</small>
            )}
            <small className="text-muted">
              Horas reservadas / horas posibles (lunes a viernes).
            </small>
          </Card>
        </Col>

        {/* KPI Churn */}
          <Col md={4}>
            <Card className="p-3 shadow-sm">
              <h6 className="text-muted mb-1">Churn rate (mes actual)</h6>
              {loadingMes ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <h3 className="mb-2">{ultimoChurn.churn}%</h3>
              )}
              {errorMes && (
                <small className="text-danger d-block mb-1">{errorMes}</small>
              )}

              {/* Texto + badge en la misma fila */}
              <small className="text-muted d-flex justify-content-between align-items-center">
                <span>
                  Clientes que se fueron:{" "}
                  <strong>{ultimoChurn.clientesSeFueron}</strong> / Activos:{" "}
                  <strong>{ultimoChurn.activosInicio}</strong>
                </span>

                <Badge
                  bg={ultimoChurn.churn > 3 ? "danger" : "success"}
                  className="ms-2"
                >
                  {ultimoChurn.churn > 3 ? "Atención" : "Saludable"}
                </Badge>
              </small>
            </Card>
          </Col>

      </Row>

      {/* ===== FILTRO INFERIOR (AÑO PARA GRÁFICOS) ===== */}
      <Row className="mt-4 g-3">
        <Col xs={12} md={3}>
          <Form.Group>
            <Form.Label>Año (gráficos)</Form.Label>
            <Form.Select value={anioGraficos} onChange={handleAnioGraficosChange}>
              <option value={currentYear - 1}>{currentYear - 1}</option>
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear + 1}>{currentYear + 1}</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {loadingAnio && (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" />
        </div>
      )}
      {errorAnio && (
        <Alert variant="danger" className="mt-3">
          {errorAnio}
        </Alert>
      )}

      {!loadingAnio && !errorAnio && (
        <>
          {/* Fila 2: Ene-Jun (Nuevos clientes / Utilización) */}
          <Row className="mt-4 g-3">
            {/* Nuevos clientes Ene-Jun */}
            <Col md={6}>
              <Card className="p-3 shadow-sm">
                <h5 className="mb-3">
                  Nuevos clientes (Enero - Junio {anioGraficos})
                </h5>
                <div style={{ width: "100%", height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={nuevosPrimerSemestre}>
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
                    <ComposedChart data={utilizacionPrimerSemestre}>
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

          {/* Fila 3: Jul-Dic (Nuevos clientes / Utilización) */}
          <Row className="mt-4 g-3">
            {/* Nuevos clientes Jul-Dic */}
            <Col md={6}>
              <Card className="p-3 shadow-sm">
                <h5 className="mb-3">
                  Nuevos clientes (Julio - Diciembre {anioGraficos})
                </h5>
                <div style={{ width: "100%", height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={nuevosSegundoSemestre}>
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
                    <ComposedChart data={utilizacionSegundoSemestre}>
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

          {/* Fila 4: Churn anual */}
          <Row className="mt-4 g-3">
            <Col md={12}>
              <Card className="p-3 shadow-sm">
                <h5 className="mb-3">
                  Churn rate por mes (Enero - Diciembre {anioGraficos})
                </h5>
                <div style={{ width: "100%", height: 260 }}>
                  <ResponsiveContainer>
                    <LineChart data={churnPorMes}>
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
                        stroke="#dc3545"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
