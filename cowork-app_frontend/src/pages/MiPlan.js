import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert, Row, Col, Badge } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { getAllPlanes } from "../services/planService";
import { getHorasRestantes } from "../services/usuarioService";

export default function MiPlan() {
  const { currentUser } = useAuth();
  const [planes, setPlanes] = useState([]);
  const [horasInfo, setHorasInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser?.id) return;

    const cargar = async () => {
      setLoading(true);
      setError("");

      try {
        // Pedimos planes activos + horas restantes del usuario en paralelo
        const [resPlanes, resHoras] = await Promise.all([
          getAllPlanes(),
          getHorasRestantes(currentUser.id),
        ]);

        setPlanes(resPlanes.data);
        setHorasInfo(resHoras.data);
      } catch (err) {
        console.error("Error al cargar información de planes:", err);
        setError("No se pudo cargar la información de tu plan.");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [currentUser]);

  // ¿El usuario tiene plan asociado?
  const planId = currentUser?.planId ?? null;
  const planActual =
    planId && planes.length > 0
      ? planes.find((p) => p.id === planId)
      : null;

  const tienePlan =
    !!planId && (!!planActual || !!horasInfo?.nombrePlan);

  const formatearMoneda = (valor) =>
    typeof valor === "number"
      ? `$${valor.toLocaleString("es-CL")}`
      : "-";

  return (
    <div className="container mt-4">
      <h2>Mi plan</h2>

      <Card className="mt-3 p-3 shadow-sm">
        {loading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" />
          </div>
        )}

        {!loading && error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <>
            {tienePlan ? (
              <>
                <h5 className="mb-3">Detalle de tu plan actual</h5>

                <Card className="mb-4 p-3">
                  <h4 className="mb-1">
                    {planActual?.nombre || horasInfo?.nombrePlan}
                  </h4>
                  {planActual && (
                    <p className="mb-1 text-muted">
                      {formatearMoneda(planActual.precioMensual)} / mes ·{" "}
                      {planActual.tiempoIncluido} horas incluidas
                    </p>
                  )}

                  {horasInfo && (
                    <>
                      <hr />
                      <Row>
                        <Col xs={12} md={4}>
                          <div className="mb-2">
                            <span className="text-muted d-block">
                              Horas incluidas este mes
                            </span>
                            <strong>{horasInfo.horasIncluidas ?? 0}</strong>
                          </div>
                        </Col>
                        <Col xs={12} md={4}>
                          <div className="mb-2">
                            <span className="text-muted d-block">
                              Horas usadas
                            </span>
                            <strong>{horasInfo.horasUsadas ?? 0}</strong>
                          </div>
                        </Col>
                        <Col xs={12} md={4}>
                          <div className="mb-2">
                            <span className="text-muted d-block">
                              Horas restantes
                            </span>
                            <strong>
                              {horasInfo.horasRestantes ?? 0}{" "}
                              {typeof horasInfo.horasRestantes === "number" &&
                                horasInfo.horasRestantes < 0 && (
                                  <Badge bg="warning" className="ms-1">
                                    Sobreconsumo
                                  </Badge>
                                )}
                            </strong>
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}
                </Card>

                {/* Opcional: mostrar otros planes para upgrade */}
                {planes.length > 0 && (
                  <>
                    <h5 className="mb-3">Otros planes disponibles</h5>
                    <Row>
                      {planes
                        .filter((p) => p.id !== planId)
                        .map((p) => (
                          <Col key={p.id} xs={12} md={4} className="mb-3">
                            <Card className="h-100 p-3">
                              <h5 className="mb-1">{p.nombre}</h5>
                              <p className="mb-1 text-muted">
                                {formatearMoneda(p.precioMensual)} / mes
                              </p>
                              <p className="mb-0">
                                Incluye{" "}
                                <strong>{p.tiempoIncluido} horas</strong>
                              </p>
                            </Card>
                          </Col>
                        ))}
                    </Row>
                  </>
                )}
              </>
            ) : (
              <>
                <Alert variant="info" className="mb-4">
                  Actualmente no tienes un plan contratado.
                </Alert>

                {horasInfo && (
                  <Card className="mb-4 p-3 bg-light">
                    <h6>Uso de horas este mes</h6>
                    <p className="mb-1">
                      <strong>Horas usadas:</strong>{" "}
                      {horasInfo.horasUsadas ?? 0}
                    </p>
                    <p className="mb-0 text-muted">
                      Como no tienes plan contratado, las{" "}
                      <strong>horas restantes</strong> pueden aparecer como
                      valor negativo para indicar consumo sin plan.
                    </p>
                  </Card>
                )}

                <h5 className="mb-3">Planes disponibles</h5>
                {planes.length === 0 ? (
                  <p className="text-muted">
                    No hay planes configurados en el sistema.
                  </p>
                ) : (
                  <Row>
                    {planes.map((p) => (
                      <Col key={p.id} xs={12} md={4} className="mb-3">
                        <Card className="h-100 p-3">
                          <h5 className="mb-1">{p.nombre}</h5>
                          <p className="mb-1 text-muted">
                            {formatearMoneda(p.precioMensual)} / mes
                          </p>
                          <p className="mb-0">
                            Incluye{" "}
                            <strong>{p.tiempoIncluido} horas</strong>
                          </p>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}

                <p className="mt-3 text-muted">
                  Para contratar un plan, comunícate con el administrador del
                  cowork.
                </p>
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
