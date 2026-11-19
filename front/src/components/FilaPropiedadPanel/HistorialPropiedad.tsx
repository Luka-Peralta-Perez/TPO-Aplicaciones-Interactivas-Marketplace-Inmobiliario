import { useState } from "react";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { HistorialEstadoPropiedad } from "../../types";
import { EstadoCarga, EstadoError, EstadoVacio } from "../Estados/Estados";
import styles from "./FilaPropiedadPanel.module.css";

type Props = {
    propiedadId: number;
};

export function HistorialPropiedad({ propiedadId }: Props) {
    const [historialAbierto, setHistorialAbierto] = useState(false);
    const [historial, setHistorial] = useState<HistorialEstadoPropiedad[] | null>(null);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);
    const [errorHistorial, setErrorHistorial] = useState<string | null>(null);

    async function verHistorial() {
        if (historialAbierto) {
            setHistorialAbierto(false);
            return;
        }

        setHistorialAbierto(true);

        if (historial !== null) {
            return;
        }

        try {
            setCargandoHistorial(true);
            setErrorHistorial(null);

            const datos = await propiedadesService.obtenerHistorial(propiedadId);
            setHistorial(datos);
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorHistorial(error.message);
            } else {
                setErrorHistorial("No se pudo cargar el historial.");
            }
        } finally {
            setCargandoHistorial(false);
        }
    }

    return (
        <>
            <button
                className={styles.botonHistorial}
                type="button"
                onClick={() => void verHistorial()}>
                {historialAbierto ? "Ocultar historial" : "Ver historial"}
            </button>

            {historialAbierto && (
                <div className={styles.historial}>
                    {cargandoHistorial ? (
                        <EstadoCarga mensaje="Cargando historial..." />
                    ) : errorHistorial ? (
                        <EstadoError mensaje={errorHistorial} />
                    ) : historial?.length ? (
                        <ul className={styles.historialLista}>
                            {historial.map((cambio) => (
                                <li key={cambio.id} className={styles.historialItem}>
                                    <strong>{cambio.estadoAnterior}</strong>
                                    {" → "}
                                    <strong>{cambio.estadoNuevo}</strong>
                                    {" — "}
                                    {new Date(cambio.creadoEn).toLocaleString("es-AR")}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EstadoVacio mensaje="No hay cambios de estado registrados." />
                    )}
                </div>
            )}
        </>
    );
}