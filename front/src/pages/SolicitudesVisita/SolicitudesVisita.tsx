import { useEffect, useState } from "react";
import { ApiError } from "../../comun/api";
import { inmobiliariasService } from "../../services/inmobiliarias";
import { visitasService } from "../../services/visitas";
import type { EstadoSolicitudVisita, SolicitudVisita } from "../../types";

export default function SolicitudesVisita() {
    const [solicitudes, setSolicitudes] = useState<SolicitudVisita[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actualizadoId, setActualizadoId] = useState<number | null>(null);
    const [filtro, setFiltro] = useState<"PENDIENTES" | "TODAS">("PENDIENTES");

    useEffect(() => {
        async function cargarSolicitudes() {
            try {
                setCargando(true);
                setError(null);

                const inmobiliaria = await inmobiliariasService.obtenerPropia();
                const datos = await visitasService.listar(inmobiliaria.id);

                setSolicitudes(datos);
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudieron cargar las solicitudes de visita.");
                }
            } finally {
                setCargando(false);
            }
        }
        cargarSolicitudes();
    }, []);

    async function cambiarEstado(solicitudId: number, nuevoEstado: EstadoSolicitudVisita) {
        try {
            setActualizadoId(solicitudId);
            setError(null);

            await visitasService.cambiarEstado(solicitudId, nuevoEstado);
            setSolicitudes((anteriores) => anteriores.map((solicitud) =>
                solicitud.id === solicitudId ? {
                    ...solicitud,
                    estado: nuevoEstado,
                }
                    : solicitud
            ));
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("No se pudo actualizar la solicitud.");
            }
        } finally {
            setActualizadoId(null);
        }
    }

    if (cargando) {
        return (
            <section>
                <p>Cargando solicitudes de visita...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <h1>Solicitudes de visita</h1>
                <p>{error}</p>
            </section>
        );
    }

    const solicitudesFiltradas = filtro === "PENDIENTES"
        ? solicitudes.filter((solicitud) => solicitud.estado === "PENDIENTE")
        : solicitudes;

    const solicitudesPorPropiedad = solicitudesFiltradas.reduce((grupos, solicitud) => {
        const propiedadId = solicitud.propiedad.id;

        if (!grupos[propiedadId]) {
            grupos[propiedadId] = {
                titulo: solicitud.propiedad.titulo,
                solicitudes: [],
            };
        }
        grupos[propiedadId].solicitudes.push(solicitud);
        return grupos;
    }, {} as Record<number, {
        titulo: string;
        solicitudes: SolicitudVisita[];
    }>
    );

    return (
        <section>
            <h1>Solicitudes de visita</h1>
            <div>
                <button
                    type="button"
                    onClick={() => setFiltro("PENDIENTES")}
                    disabled={filtro === "PENDIENTES"}>
                    Pendientes
                </button>
                <button
                    type="button"
                    onClick={() => setFiltro("TODAS")}
                    disabled={filtro === "TODAS"}>
                    Todas
                </button>
            </div>
            {solicitudesFiltradas.length === 0 ? (
                <p>No hay solicitudes de visita.</p>
            ) : (
                Object.entries(solicitudesPorPropiedad).map(
                    ([propiedadId, grupo]) => (
                        <section key={propiedadId}>
                            <h2>{grupo.titulo}</h2>
                            {grupo.solicitudes.map((solicitud) => (
                                <article key={solicitud.id}>
                                    <p>
                                        <strong>Nombre:</strong>{" "}
                                        {solicitud.nombreSolicitante}
                                    </p>
                                    <p>
                                        <strong>Teléfono:</strong>{" "}
                                        <a href={`tel:${solicitud.telefono.replace(/[^\d+]/g, "")}`}>
                                            {solicitud.telefono}
                                        </a>
                                    </p>
                                    <p>
                                        <strong>Fecha propuesta:</strong>{" "}
                                        {new Date(solicitud.fechaPropuesta).toLocaleString("es-AR")}
                                    </p>
                                    {solicitud.mensaje && (
                                        <p>
                                            <strong>Mensaje:</strong>{" "}
                                            {solicitud.mensaje}
                                        </p>
                                    )}
                                    <p>
                                        <strong>Estado:</strong>{" "}
                                        {solicitud.estado}
                                    </p>

                                    {solicitud.estado === "PENDIENTE" && (
                                        <div>
                                            <button
                                                type="button"
                                                disabled={actualizadoId === solicitud.id}
                                                onClick={() => cambiarEstado(solicitud.id, "CONFIRMADA")}>
                                                Confirmar
                                            </button>
                                            <button
                                                type="button"
                                                disabled={actualizadoId === solicitud.id}
                                                onClick={() => cambiarEstado(solicitud.id, "RECHAZADA")}>
                                                Rechazar
                                            </button>
                                        </div>
                                    )}

                                    {solicitud.estado === "CONFIRMADA" && (
                                        <div>
                                            <button
                                                type="button"
                                                disabled={actualizadoId === solicitud.id}
                                                onClick={() => cambiarEstado(solicitud.id, "REALIZADA")}>
                                                Marcar realizada
                                            </button>
                                            <button
                                                type="button"
                                                disabled={actualizadoId === solicitud.id}
                                                onClick={() => cambiarEstado(solicitud.id, "CANCELADA")}>
                                                Cancelar
                                            </button>
                                        </div>
                                    )}

                                </article>
                            ))}
                        </section>
                    )
                )
            )}
        </section>
    );
}
