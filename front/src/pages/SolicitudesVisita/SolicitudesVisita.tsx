import styles from "./SolicitudesVisita.module.css";
import { EstadoCarga, EstadoError, EstadoVacio } from "../../components/Estados/Estados";
import { DialogoConfirmacion } from "../../components/DialogoConfirmacion/DialogoConfirmacion";
import { GrupoSolicitudesVisita } from "../../components/GrupoSolicitudesVisita/GrupoSolicitudesVisita";
import { useSolicitudesVisita } from "../../hooks/useSolicitudesVisita";

export default function SolicitudesVisita() {
    const {
        cargando,
        error,
        errorAccion,
        filtro,
        setFiltro,
        actualizadoId,
        confirmacion,
        setConfirmacion,
        cambiarEstado,
        confirmarCambioEstado,
        solicitudesFiltradas,
        solicitudesPorPropiedad,
    } = useSolicitudesVisita();

    if (cargando) {
        return (
            <section className={styles.contenedor}>
                <EstadoCarga mensaje="Cargando solicitudes de visita..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.contenedor}>
                <h1 className={styles.titulo}>
                    Solicitudes de visita
                </h1>
                <EstadoError mensaje={error} />
            </section>
        );
    }

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

            {errorAccion && (
                <p className={styles.error}>
                    {errorAccion}
                </p>
            )}

            {solicitudesFiltradas.length === 0 ? (
                <EstadoVacio mensaje="No hay solicitudes de visita" />
            ) : (
                Object.entries(solicitudesPorPropiedad).map(([propiedadId, grupo]) => (
                    <GrupoSolicitudesVisita
                        key={propiedadId}
                        titulo={grupo.titulo}
                        solicitudes={grupo.solicitudes}
                        actualizadoId={actualizadoId}
                        onCambiarEstado={cambiarEstado} />
                ))
            )}

            <DialogoConfirmacion
                abierto={confirmacion !== null}
                titulo={confirmacion?.titulo ?? ""}
                mensaje={confirmacion?.mensaje ?? ""}
                textoConfirmar={confirmacion?.textoConfirmar ?? "Confirmar"}
                cargando={confirmacion !== null && actualizadoId === confirmacion.solicitudId}
                onConfirmar={confirmarCambioEstado}
                onCancelar={() => setConfirmacion(null)} />
        </section>
    );
}
