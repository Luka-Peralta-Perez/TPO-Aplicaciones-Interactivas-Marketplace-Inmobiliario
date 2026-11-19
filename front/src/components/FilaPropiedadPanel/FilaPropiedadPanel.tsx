import { Link } from "react-router-dom";
import type { PropiedadPanel as PropiedadPanelType } from "../../types";
import styles from "./FilaPropiedadPanel.module.css";
import { HistorialPropiedad } from "./HistorialPropiedad";

type Props = {
    propiedad: PropiedadPanelType;
    actualizando: boolean;
    onCambiarEstado: (
        propiedadId: number,
        nuevoEstado: PropiedadPanelType["estado"]
    ) => void;
};

const clasesEstado: Record<PropiedadPanelType["estado"], string> = {
    BORRADOR: styles.borrador,
    PUBLICADA: styles.publicada,
    RESERVADA: styles.reservada,
    PAUSADA: styles.pausada,
    VENDIDA: styles.vendida,
    ALQUILADA: styles.alquilada,
    CANCELADA: styles.cancelada,
};

export function FilaPropiedadPanel({ propiedad, actualizando, onCambiarEstado }: Props) {

    function cambiarEstado(nuevoEstado: PropiedadPanelType["estado"]) {
        onCambiarEstado(propiedad.id, nuevoEstado);
    }

    const puedeEditar =
        propiedad.estado !== "VENDIDA" &&
        propiedad.estado !== "ALQUILADA" &&
        propiedad.estado !== "CANCELADA";

    return (
        <tr id={`propiedad-${propiedad.id}`}>
            <td>
                <img
                    src={propiedad.fotoPortada}
                    alt={propiedad.titulo}
                    className={styles.imagenPropiedad}
                />
            </td>

            <td>{propiedad.titulo}</td>
            <td>{propiedad.tipo}</td>
            <td>{propiedad.operacion}</td>

            <td>
                {propiedad.moneda}{" "}
                {Number(propiedad.precio).toLocaleString("es-AR")}
            </td>

            <td>{propiedad.zona}</td>

            <td>
                <span className={`${styles.estado} ${clasesEstado[propiedad.estado]}`}>
                    {propiedad.estado}
                </span>
            </td>

            <td>
                <div className={styles.acciones}>
                    {puedeEditar && (
                        <Link
                            className={styles.editar}
                            to={`/panel/propiedades/${propiedad.id}/editar`}
                        >
                            Editar
                        </Link>
                    )}

                    {propiedad.estado === "BORRADOR" && (
                        <button
                            className={styles.botonAccion}
                            type="button"
                            disabled={actualizando}
                            onClick={() => cambiarEstado("PUBLICADA")}>
                            Publicar
                        </button>
                    )}

                    {propiedad.estado === "PUBLICADA" && (
                        <>
                            <button
                                className={styles.botonAccion}
                                type="button"
                                disabled={actualizando}
                                onClick={() => cambiarEstado("PAUSADA")}>
                                Pausar
                            </button>

                            <button
                                className={styles.botonAccion}
                                type="button"
                                disabled={actualizando}
                                onClick={() => cambiarEstado("RESERVADA")}
                            >
                                Marcar reservada
                            </button>

                            <button
                                className={styles.botonDestructivo}
                                type="button"
                                disabled={actualizando}
                                onClick={() => cambiarEstado("CANCELADA")}>
                                Dar de baja
                            </button>
                        </>
                    )}

                    {propiedad.estado === "PAUSADA" && (
                        <>
                            <button
                                className={styles.botonAccion}
                                type="button"
                                disabled={actualizando}
                                onClick={() => cambiarEstado("PUBLICADA")}>
                                Volver a publicar
                            </button>

                            <button
                                className={styles.botonDestructivo}
                                type="button"
                                disabled={actualizando}
                                onClick={() => cambiarEstado("CANCELADA")}>
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
                                    disabled={actualizando}
                                    onClick={() => cambiarEstado("VENDIDA")}>
                                    Marcar vendida
                                </button>
                            ) : (
                                <button
                                    className={styles.botonDestructivo}
                                    type="button"
                                    disabled={actualizando}
                                    onClick={() => cambiarEstado("ALQUILADA")}>
                                    Marcar alquilada
                                </button>
                            )}

                            <button
                                className={styles.botonDestructivo}
                                type="button"
                                disabled={actualizando}
                                onClick={() => cambiarEstado("CANCELADA")}>
                                Dar de baja
                            </button>
                        </>
                    )}

                    <HistorialPropiedad
                        key={`${propiedad.id}-${propiedad.estado}`}
                        propiedadId={propiedad.id} />

                </div>
            </td>
        </tr>
    );
}