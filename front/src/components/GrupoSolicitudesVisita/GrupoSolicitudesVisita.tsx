import type { EstadoSolicitudVisita, SolicitudVisita } from "../../types";
import styles from "./GrupoSolicitudesVisita.module.css";

type Props = {
    titulo: string;
    solicitudes: SolicitudVisita[];
    actualizadoId: number | null;
    onCambiarEstado: (solicitudId: number, nuevoEstado: EstadoSolicitudVisita) => void;
};

const clasesEstado: Record<EstadoSolicitudVisita, string> = {
    PENDIENTE: styles.pendiente,
    CONFIRMADA: styles.confirmada,
    REALIZADA: styles.realizada,
    CANCELADA: styles.cancelada,
    RECHAZADA: styles.rechazada,
};

export function GrupoSolicitudesVisita({ titulo, solicitudes, actualizadoId, onCambiarEstado }: Props) {
    return (
        <section className={styles.grupoPropiedad}>
            <h2 className={styles.tituloPropiedad}>{titulo}</h2>

            {solicitudes.map((solicitud) => (
                <article
                    key={solicitud.id}
                    id={`visita-${solicitud.id}`}
                    className={styles.tarjeta}>

                    <p>
                        <strong>Nombre:</strong>{" "}
                        {solicitud.nombreSolicitante}
                    </p>

                    <p>
                        <strong>Teléfono:</strong>{" "}
                        <a
                            className={styles.telefono}
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
                        <span className={`${styles.estado} ${clasesEstado[solicitud.estado]}`}>
                            {solicitud.estado}
                        </span>
                    </p>

                    {solicitud.estado === "PENDIENTE" && (
                        <div className={styles.acciones}>
                            <button
                                type="button"
                                className={`${styles.boton} ${styles.botonConfirmar}`}>
                                Confirmar
                            </button>

                            <button
                                type="button"
                                className={`${styles.boton} ${styles.botonRechazar}`}>
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
                                onClick={() => onCambiarEstado(solicitud.id, "REALIZADA")}>
                                Marcar realizada
                            </button>

                            <button
                                className={styles.boton}
                                type="button"
                                disabled={actualizadoId === solicitud.id}
                                onClick={() => onCambiarEstado(solicitud.id, "CANCELADA")}>
                                Cancelar
                            </button>
                        </div>
                    )}
                </article>
            ))}
        </section>
    );
}