import { useEffect, useState } from "react";
import { ApiError } from "../../comun/api";
import { inmobiliariasService } from "../../services/inmobiliarias";
import { visitasService } from "../../services/visitas";
import type { EstadoSolicitudVisita, SolicitudVisita } from "../../types";
import styles from "./SolicitudesVisita.module.css"

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
            <section className={styles.contenedor}>
                <p className={styles.vacio}>
                    Cargando solicitudes de visita...
                    </p>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.contenedor}>
                <h1 className={styles.titulo}>
                    Solicitudes de visita
                </h1>
                <p className={styles.error}>
                    {error}
                </p>
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
        <section className={styles.contenedor}>
            <h1 className={styles.titulo}>
                Solicitudes de visita
            </h1>
            <div className={styles.filtros}>
                <button
                    className={styles.botonFiltro}
                    type="button"
                    onClick={() => setFiltro("PENDIENTES")}
                    disabled={filtro === "PENDIENTES"}>
                    Pendientes
                </button>
                <button
                    className={styles.botonFiltro}
                    type="button"
                    onClick={() => setFiltro("TODAS")}
                    disabled={filtro === "TODAS"}>
                    Todas
                </button>
            </div>
            {solicitudesFiltradas.length === 0 ? (
                <p className={styles.vacio}>
                    No hay solicitudes de visita.
                </p>
            ) : (
                Object.entries(solicitudesPorPropiedad).map(
                    ([propiedadId, grupo]) => (
                        <section key={propiedadId}
                            className={styles.grupoPropiedad}>
                            <h2 className={styles.tituloPropiedad}>
                                {grupo.titulo}
                            </h2>
                            {grupo.solicitudes.map((solicitud) => (
                                <article key={solicitud.id}
                                    className={styles.tarjeta}>
                                    <p>
                                        <strong>Nombre:</strong>{" "}
                                        {solicitud.nombreSolicitante}
                                    </p>
                                    <p>
                                        <strong>Teléfono:</strong>{" "}
                                        <a className={styles.telefono}
                                            href={`tel:${solicitud.telefono.replace(/[^\d+]/g, "")}`}>
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
                                        <span className={styles.estado}>
                                            {solicitud.estado}
                                        </span>
                                    </p>

                                    {solicitud.estado === "PENDIENTE" && (
                                        <div className={styles.acciones}>
                                            <button
                                                className={styles.boton}
                                                type="button"
                                                disabled={actualizadoId === solicitud.id}
                                                onClick={() => cambiarEstado(solicitud.id, "CONFIRMADA")}>
                                                Confirmar
                                            </button>
                                            <button
                                                className={styles.boton}
                                                type="button"
                                                disabled={actualizadoId === solicitud.id}
                                                onClick={() => cambiarEstado(solicitud.id, "RECHAZADA")}>
                                                Rechazar
                                            </button>
                                        </div>
                                    )}

                                    {solicitud.estado === "CONFIRMADA" && (
                                        <div className={styles.acciones}>
                                            <button
                                                className={styles.boton}
                                                type="button"
                                                disabled={actualizadoId === solicitud.id}
                                                onClick={() => cambiarEstado(solicitud.id, "REALIZADA")}>
                                                Marcar realizada
                                            </button>
                                            <button
                                                className={styles.boton}
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
