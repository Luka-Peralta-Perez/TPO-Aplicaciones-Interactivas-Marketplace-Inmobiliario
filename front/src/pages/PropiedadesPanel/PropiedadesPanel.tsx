import { useEffect, useState } from "react";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { PropiedadPanel as PropiedadPanelType } from "../../types";
import styles from "./PropiedadesPanel.module.css";

export default function PropiedadesPanel() {
    const [propiedades, setPropiedades] = useState<PropiedadPanelType[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (cargando) {
        return (
            <section className={styles.contenedor}>
                <h1>Mis propiedades</h1>
                <p>Cargando propiedades...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.contenedor}>
                <h1>Mis propiedades</h1>
                <p className={styles.error}>{error}</p>
            </section>
        );
    }

    return (
        <section className={styles.contenedor}>
            <h1>Mis propiedades</h1>
            {propiedades.length === 0 ? (
                <p>No tenés propiedades cargadas.</p>
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
                            </tr>
                        </thead>

                        <tbody>
                            {propiedades.map((propiedad) => (
                                <tr key={propiedad.id}>
                                    <td>
                                        <img
                                        src={propiedad.fotoPortada}
                                        alt={propiedad.titulo}
                                        className={styles.imagenPropiedad}/>
                                    </td>
                                    <td>{propiedad.titulo}</td>
                                    <td>{propiedad.tipo}</td>
                                    <td>{propiedad.operacion}</td>
                                    <td>{propiedad.moneda}{" "}
                                        {Number(propiedad.precio).toLocaleString("es-AR")}
                                    </td>
                                    <td>{propiedad.zona}</td>
                                    <td>{propiedad.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            }
        </section>
    );
}