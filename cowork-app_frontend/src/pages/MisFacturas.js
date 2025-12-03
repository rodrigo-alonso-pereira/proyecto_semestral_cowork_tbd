import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert, Badge, Button, Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { getFacturasByUsuario } from "../services/facturaService";

export default function MisFacturas() {
  const { currentUser } = useAuth();
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);

  const handleOpenModal = (factura) => {setSelectedFactura(factura);
    setShowModal(true);
    };

    const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFactura(null);
    };

  useEffect(() => {
    if (!currentUser?.id) return;

    const cargar = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getFacturasByUsuario(currentUser.id);
        // Ordenar por fecha emisión (más recientes primero)
        const ordenadas = [...res.data].sort(
          (a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision)
        );
        setFacturas(ordenadas);
      } catch (err) {
        console.error("Error al cargar facturas:", err);
        setError("No se pudieron cargar tus facturas. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [currentUser]);

  const formatearFecha = (isoDate) => {
    if (!isoDate) return "-";
    return new Date(isoDate).toLocaleDateString("es-CL");
  };

  const formatearTotal = (valor) =>
    typeof valor === "number"
      ? `$${valor.toLocaleString("es-CL")}`
      : "-";

  const badgeEstado = (nombre) => {
    const n = (nombre || "").toLowerCase();
    if (n.includes("pagada")) return <Badge bg="success">Pagada</Badge>;
    if (n.includes("pend")) return <Badge bg="warning">Pendiente</Badge>;
    if (n.includes("venc")) return <Badge bg="danger">Vencida</Badge>;
    return <Badge bg="secondary">{nombre}</Badge>;
  };

  return (
    <div className="container mt-4">
      <h2>Mis facturas</h2>

      <Card className="mt-3 p-3 shadow-sm">
        {loading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" />
          </div>
        )}

        {!loading && error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && facturas.length === 0 && (
          <div className="text-center my-4">
            <p className="mb-1">
              Aún no tienes facturas registradas en el sistema.
            </p>
            <p className="text-muted mb-0">
              Tus facturas aparecerán aquí a medida que se generen según tus
              reservas y planes contratados.
            </p>
          </div>
        )}

        {!loading && !error && facturas.length > 0 && (
          <Table hover responsive className="mt-2">
            <thead>
              <tr>
                <th>#</th>
                <th>N° factura</th>
                <th>Fecha emisión</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th className="text-end">Total</th>
                <th className="text-center">Acciones</th> 
              </tr>
            </thead>
            <tbody>
            {facturas.map((f, idx) => (
                <tr key={f.id}>
                <td>{idx + 1}</td>
                <td>{f.numeroFactura}</td>
                <td>{formatearFecha(f.fechaEmision)}</td>
                <td>{f.descripcion}</td>
                <td>{badgeEstado(f.estadoFacturaNombre)}</td>
                <td className="text-end">{formatearTotal(f.total)}</td>
                <td className="text-center">
                    <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => handleOpenModal(f)}
                    >
                    Ver detalle
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
          </Table>
        )}
        {/* Modal de detalle de factura */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
            <Modal.Title>Detalle de factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {selectedFactura && (
            <>
                <p>
                <strong>N° factura:</strong> {selectedFactura.numeroFactura}
                </p>
                <p>
                <strong>Fecha emisión:</strong>{" "}
                {formatearFecha(selectedFactura.fechaEmision)}
                </p>
                <p>
                <strong>Estado:</strong>{" "}
                {badgeEstado(selectedFactura.estadoFacturaNombre)}
                </p>
                <p>
                <strong>Total:</strong> {formatearTotal(selectedFactura.total)}
                </p>

                <hr />

                <p>
                <strong>Descripción:</strong>
                <br />
                {selectedFactura.descripcion || "Sin descripción adicional."}
                </p>

            </>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
            </Button>
        </Modal.Footer>
        </Modal>
      </Card>
    </div>
  );
}
