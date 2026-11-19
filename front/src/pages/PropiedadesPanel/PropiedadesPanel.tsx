import { useEffect, useState } from "react";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { PropiedadPanel as PropiedadPanelType } from "../../types";
import styles from "./PropiedadesPanel.module.css";
import { Link, useSearchParams } from "react-router-dom";
import { EstadoCarga, EstadoError, EstadoVacio } from "../../components/Estados/Estados";
import { DialogoConfirmacion } from "../../components/DialogoConfirmacion/DialogoConfirmacion";
import { FilaPropiedadPanel } from "../../components/FilaPropiedadPanel/FilaPropiedadPanel";

type ConfirmacionEstado = {
    propiedadId: number;
    nuevoEstado: PropiedadPanelType["estado"];
    titulo: string;
    mensaje: string;
    textoConfirmar: string;
};

export default function PropiedadesPanel() {
    const [propiedades, setPropiedades] = useState<PropiedadPanelType[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorAccion, setErrorAccion] = useState<string | null>(null);
    const [actualizandoId, setActualizandoId] = useState<number | null>(null);
    const [searchParams] = useSearchParams();
    const propiedadOrigen = searchParams.get("propiedad");
    const [confirmacion, setConfirmacion] = useState<ConfirmacionEstado | null>(null);

    useEffect(() => {
        async function cargarPropiedades() {
            try {
                setCargando(true);
                setError(null);

                const datos = await propiedadesService.listarPropias();
                setPropiedades(datos);
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudieron cargar las propiedades.");
                }
            } finally {
                setCargando(false);
            }
        }
        cargarPropiedades();
    }, []);

    useEffect(() => {
        if (cargando || !propiedadOrigen) {
            return;
        }

        const elemento = document.getElementById(`propiedad-${propiedadOrigen}`);

        elemento?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, [cargando, propiedadOrigen]);

    async function ejecutarCambioEstado(propiedadId: number, nuevoEstado: PropiedadPanelType["estado"]) {
        try {
            setActualizandoId(propiedadId);
            setErrorAccion(null);

            await propiedadesService.cambiarEstado(propiedadId, nuevoEstado);

            setPropiedades((anteriores) =>
                anteriores.map((propiedad) =>
                    propiedad.id === propiedadId ? {
                        ...propiedad,
                        estado: nuevoEstado,
                    }
                        : propiedad
                ));
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorAccion(error.message);
            } else {
                setErrorAccion("No se pudo cambiar el estado de la propiedad");
            }
        } finally {
            setActualizandoId(null);
        }
    }

    function cambiarEstado(propiedadId: number, nuevoEstado: PropiedadPanelType["estado"]) {
        if (nuevoEstado === "CANCELADA") {
            setConfirmacion({
                propiedadId,
                nuevoEstado,
                titulo: "Dar de baja propiedad",
                mensaje: "¿Seguro que querés dar de baja esta propiedad? Esta acción no se puede deshacer.",
                textoConfirmar: "Dar de baja",
            });
            return;
        }

        if (nuevoEstado === "VENDIDA") {
            setConfirmacion({
                propiedadId,
                nuevoEstado,
                titulo: "Marcar propiedad como vendida",
                mensaje: "¿Seguro que querés marcar esta propiedad como vendida?",
                textoConfirmar: "Marcar vendida",
            });
            return;
        }

        if (nuevoEstado === "ALQUILADA") {
            setConfirmacion({
                propiedadId,
                nuevoEstado,
                titulo: "Marcar propiedad como alquilada",
                mensaje: "¿Seguro que querés marcar esta propiedad como alquilada?",
                textoConfirmar: "Marcar alquilada",
            });
            return;
        }
        void ejecutarCambioEstado(propiedadId, nuevoEstado);
    }

    async function confirmarCambioEstado() {
        if (!confirmacion) {
            return;
        }

        const { propiedadId, nuevoEstado } = confirmacion;
        await ejecutarCambioEstado(propiedadId, nuevoEstado);
        setConfirmacion(null);
    }

    if (cargando) {
    return (
        <section className={styles.contenedor}>
            <h1>Mis propiedades</h1>
            <EstadoCarga mensaje="Cargando propiedades..." />
        </section>
    );
}

    if (error) {
        return (
            <section className={styles.contenedor}>
                <h1>Mis propiedades</h1>
                <Link
                    to="/panel/propiedades/nueva"
                    className={styles.botonNuevaPropiedad}>
                    Nueva propiedad
                </Link>
                <EstadoError mensaje={error} />
            </section>
        );
    }

    return (
        <section className={styles.contenedor}>
            <div className={styles.encabezado}>
                <h1>Mis propiedades</h1>

                <Link to="/panel/propiedades/nueva"
                    className={styles.botonNuevaPropiedad}
                >
                    Nueva propiedad
                </Link>
            </div>
            {errorAccion && (
                <p className={styles.error}>
                    {errorAccion}
                </p>
            )}
            {propiedades.length === 0 ? (
                <EstadoVacio mensaje="No tenés propiedades cargadas." />
            ) : (
                <div className={styles.tablaContenedor}>
                    <table className={styles.tabla}>
                        <thead>
                            <tr>
                                <th>Foto</th>
                                <th>Título</th>
                                <th>Tipo</th>
                                <th>Operación</th>
                                <th>Precio</th>
                                <th>Zona</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {propiedades.map((propiedad) => (
                                <FilaPropiedadPanel
                                    key={propiedad.id}
                                    propiedad={propiedad}
                                    actualizando={actualizandoId === propiedad.id}
                                    onCambiarEstado={cambiarEstado} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            }
            <DialogoConfirmacion
                abierto={confirmacion !== null}
                titulo={confirmacion?.titulo ?? ""}
                mensaje={confirmacion?.mensaje ?? ""}
                textoConfirmar={confirmacion?.textoConfirmar ?? "Confirmar"}
                cargando={confirmacion !== null &&
                    actualizandoId === confirmacion.propiedadId
                }
                onConfirmar={confirmarCambioEstado}
                onCancelar={() => setConfirmacion(null)}
            />
        </section >
    );
}