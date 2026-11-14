import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { PropiedadDetalle as PropiedadDetalleType } from "../../types";
import styles from "./DetallePropiedad.module.css";

export default function DetallePropiedad() {
    const { id } = useParams();
    const [propiedad, setPropiedad] = useState<PropiedadDetalleType | null>(null);
    const [fotoSeleccionada, setFotoSeleccionada] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function cargarPropiedad() {
            const propiedadId = Number(id);

            if (!propiedadId) {
                setError("La propiedad indicada no es válida.");
                setCargando(false);
                return;
            }

            try {
                setCargando(true);
                setError(null);

                const datos = await propiedadesService.obtener(propiedadId);

                setPropiedad(datos);
                setFotoSeleccionada(datos.fotoPortada || datos.fotos[0] || "");
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudo cargar la propiedad.");
                }
            } finally {
                setCargando(false);
            }
        }
        cargarPropiedad();
    }, [id]);

    if (cargando) {
        return (
            <section className={styles.contenedor}>
                <p>Cargando propiedad...</p>
            </section>
        );
    }

    if (error || !propiedad) {
        return (
            <section className={styles.contenedor}>
                <Link to="/">← Volver</Link>
                <p className={styles.error}>
                    {error ?? "Propiedad no encontrada."}
                </p>
            </section>
        );
    }

    const esTerreno = propiedad.tipo === "TERRENO";

    return (
        <section className={styles.contenedor}>
            <div className={styles.encabezado}>
                <Link to="/">
                    ← Volver a propiedades
                </Link>
            </div>

            <div className={styles.galeria}>
                {fotoSeleccionada && (
                    <img
                        src={fotoSeleccionada}
                        alt={propiedad.titulo}
                        className={styles.fotoPrincipal} />
                )}

                {propiedad.fotos.length > 1 && (
                    <div className={styles.miniaturas}>
                        {propiedad.fotos.map(
                            (foto, index) => (
                                <button
                                    key={`${foto}-${index}`}
                                    type="button"
                                    className={styles.botonMiniatura}
                                    onClick={() => setFotoSeleccionada(foto)}>
                                    <img
                                        src={foto}
                                        alt={`${propiedad.titulo} ${index + 1}`}
                                        className={styles.miniatura} />
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>

            <div className={styles.informacion}>
                <div>
                    <span className={styles.operacion}>
                        {propiedad.operacion}
                    </span>

                    <h1>{propiedad.titulo}</h1>
                    <p className={styles.zona}>
                        {propiedad.zona}
                    </p>
                </div>

                <p className={styles.precio}>
                    {propiedad.moneda}{" "}
                    {Number(propiedad.precio).toLocaleString("es-AR")}</p>
            </div>

            <div className={styles.datos}>
                <div>
                    <strong>Tipo</strong>
                    <span>{propiedad.tipo}</span>
                </div>

                <div>
                    <strong>Operación</strong>
                    <span>{propiedad.operacion}</span>
                </div>

                <div>
                    <strong>Dirección</strong>
                    <span>{propiedad.direccion}</span>
                </div>

                <div>
                    <strong>Superficie total</strong>
                    <span>{propiedad.superficieTotalM2} m²</span>
                </div>

                {!esTerreno && propiedad.superficieCubiertaM2 && (
                    <div>
                        <strong>Superficie cubierta</strong>
                        <span>{propiedad.superficieCubiertaM2}{" "} m²</span>
                    </div>
                )}

                {!esTerreno && propiedad.ambientes !== null && (
                    <div>
                        <strong>Ambientes</strong>
                        <span>{propiedad.ambientes}</span>
                    </div>
                )}

                {!esTerreno && propiedad.dormitorios !== null && (
                    <div>
                        <strong>Dormitorios</strong>
                        <span>{propiedad.dormitorios}</span>
                    </div>
                )}

                {!esTerreno && propiedad.banios !== null && (
                    <div>
                        <strong>Baños</strong>
                        <span>{propiedad.banios}</span>
                    </div>
                )}

                {propiedad.antiguedadAnios !== null && (
                    <div>
                        <strong>Antigüedad</strong>
                        <span>{propiedad.antiguedadAnios}{" "} años</span>
                    </div>
                )}
            </div>

            {propiedad.amenities.length > 0 && (
                <div className={styles.seccion}>
                    <h2>Amenities</h2>
                    <div className={styles.amenities}>
                        {propiedad.amenities.map(
                            (amenity) => (
                                <span
                                    key={amenity}
                                    className={styles.amenity}>
                                    {amenity}
                                </span>
                            )
                        )}
                    </div>
                </div>
            )}

            <div className={styles.seccion}>
                <h2>Descripción</h2>
                <p>{propiedad.descripcion}</p>
            </div>
        </section>
    );
}