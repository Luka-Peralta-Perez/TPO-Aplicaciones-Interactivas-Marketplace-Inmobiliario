import { useEffect, useState } from "react";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { HistorialEstadoPropiedad, PropiedadPanel as PropiedadPanelType } from "../../types";
import styles from "./PropiedadesPanel.module.css";
import { Link, useSearchParams } from "react-router-dom";
import { EstadoCarga, EstadoError, EstadoVacio } from "../../components/Estados/Estados";
import { DialogoConfirmacion } from "../../components/DialogoConfirmacion/DialogoConfirmacion";

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
    const [historiales, setHistoriales] = useState<Record<number, HistorialEstadoPropiedad[]>>({});
    const [historialAbiertoId, setHistorialAbiertoId] = useState<number | null>(null);
    const [cargandoHistorialId, setCargandoHistorialId] = useState<number | null>(null);
    const [errorHistorial, setErrorHistorial] = useState<Record<number, string>>({});
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

            setHistoriales((anteriores) => {
                const nuevos = { ...anteriores };
                delete nuevos[propiedadId];
                return nuevos;
            });
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
        setConfirmacion(null)
    }

    async function verHistorial(propiedadId: number) {
        if (historialAbiertoId === propiedadId) {
            setHistorialAbiertoId(null);
            return;
        }
        setHistorialAbiertoId(propiedadId);

        if (historiales[propiedadId]) {
            return;
        }

        try {
            setCargandoHistorialId(propiedadId);

            const historial = await propiedadesService.obtenerHistorial(propiedadId);

            setHistoriales((anteriores) => ({
                ...anteriores,
                [propiedadId]: historial,
            }));
            setErrorHistorial((anteriores) => ({
                ...anteriores,
                [propiedadId]: "",
            }));
        } catch (error) {
            setErrorHistorial((anteriores) => ({
                ...anteriores,
                [propiedadId]: error instanceof ApiError
                    ? error.message
                    : "No se pudo cargar el historial.",
            }));
        } finally {
            setCargandoHistorialId(null);
        }
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
                <EstadoError mensaje={error} />
            </section>
        );
    }

    return (
        <section className={styles.contenedor}>
            <h1>Mis propiedades</h1>
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
                                <tr
                                    key={propiedad.id}
                                    id={`propiedad-${propiedad.id}`}
                                >
                                    <td>
                                        <img
                                            src={propiedad.fotoPortada}
                                            alt={propiedad.titulo}
                                            className={styles.imagenPropiedad} />
                                    </td>
                                    <td>{propiedad.titulo}</td>
                                    <td>{propiedad.tipo}</td>
                                    <td>{propiedad.operacion}</td>
                                    <td>{propiedad.moneda}{" "}
                                        {Number(propiedad.precio).toLocaleString("es-AR")}
                                    </td>
                                    <td>{propiedad.zona}</td>
                                    <td>
                                        <span className={styles.estado}>
                                            {propiedad.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.acciones}>
                                            {propiedad.estado !== "VENDIDA" &&
                                                propiedad.estado !== "ALQUILADA" &&
                                                propiedad.estado !== "CANCELADA" && (
                                                    <Link
                                                        className={styles.editar}
                                                        to={`/panel/propiedades/${propiedad.id}/editar`}>
                                                        Editar
                                                    </Link>
                                                )}

                                            {propiedad.estado === "BORRADOR" && (
                                                <button
                                                    className={styles.botonAccion}
                                                    type="button"
                                                    disabled={actualizandoId === propiedad.id}
                                                    onClick={() => cambiarEstado(propiedad.id, "PUBLICADA")}>
                                                    Publicar
                                                </button>
                                            )}

                                            {propiedad.estado === "PUBLICADA" && (
                                                <>
                                                    <button
                                                        className={styles.botonAccion}
                                                        type="button"
                                                        disabled={actualizandoId === propiedad.id}
                                                        onClick={() => cambiarEstado(propiedad.id, "PAUSADA")}>
                                                        Pausar
                                                    </button>

                                                    <button
                                                        className={styles.botonAccion}
                                                        type="button"
                                                        disabled={actualizandoId === propiedad.id}
                                                        onClick={() => cambiarEstado(propiedad.id, "RESERVADA")}>
                                                        Marcar reservada
                                                    </button>

                                                    <button
                                                        className={styles.botonDestructivo}
                                                        type="button"
                                                        disabled={actualizandoId === propiedad.id}
                                                        onClick={() => cambiarEstado(propiedad.id, "CANCELADA")}>
                                                        Dar de baja
                                                    </button>
                                                </>
                                            )}

                                            {propiedad.estado === "PAUSADA" && (
                                                <>
                                                    <button
                                                        className={styles.botonAccion}
                                                        type="button"
                                                        disabled={actualizandoId === propiedad.id}
                                                        onClick={() => cambiarEstado(propiedad.id, "PUBLICADA")}>
                                                        Volver a publicar
                                                    </button>

                                                    <button
                                                        className={styles.botonDestructivo}
                                                        type="button"
                                                        disabled={actualizandoId === propiedad.id}
                                                        onClick={() => cambiarEstado(propiedad.id, "CANCELADA")}>
                                                        Dar de baja
                                                    </button>
                                                </>
                                            )}

                                            {propiedad.estado === "RESERVADA" && (
                                                <>
                                                    {propiedad.operacion === "VENTA" ? (
                                                        <button
                                                            className={styles.botonDestructivo}
                                                            type="button"
                                                            disabled={actualizandoId === propiedad.id}
                                                            onClick={() => cambiarEstado(propiedad.id, "VENDIDA")}>
                                                            Marcar vendida
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className={styles.botonDestructivo}
                                                            type="button"
                                                            disabled={actualizandoId === propiedad.id}
                                                            onClick={() => cambiarEstado(propiedad.id, "ALQUILADA")}>
                                                            Marcar alquilada
                                                        </button>
                                                    )}
                                                    <button
                                                        className={styles.botonDestructivo}
                                                        type="button"
                                                        disabled={actualizandoId === propiedad.id}
                                                        onClick={() => cambiarEstado(propiedad.id, "CANCELADA")}>
                                                        Dar de baja
                                                    </button>
                                                </>
                                            )}

                                            <button
                                                className={styles.botonHistorial}
                                                type="button"
                                                onClick={() => verHistorial(propiedad.id)}>
                                                {historialAbiertoId === propiedad.id
                                                    ? "Ocultar historial"
                                                    : "Ver historial"}
                                            </button>

                                            {historialAbiertoId === propiedad.id && (
                                                <div className={styles.historial}>
                                                    {cargandoHistorialId === propiedad.id ? (
                                                        <EstadoCarga mensaje="Cargando historial..." />
                                                    ) : errorHistorial[propiedad.id] ? (
                                                        <EstadoError mensaje={errorHistorial[propiedad.id]} />
                                                    ) : historiales[propiedad.id]?.length ? (
                                                        <ul className={styles.historialLista}>
                                                            {historiales[propiedad.id].map((cambio) => (
                                                                <li
                                                                    key={cambio.id}
                                                                    className={styles.historialItem}>
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
                                        </div>

                                    </td>
                                </tr>
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