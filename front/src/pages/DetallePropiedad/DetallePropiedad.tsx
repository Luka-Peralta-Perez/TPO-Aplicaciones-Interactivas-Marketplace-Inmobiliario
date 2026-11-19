import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { PropiedadDetalle as PropiedadDetalleType, ComentarioPropiedad } from "../../types";
import styles from "./DetallePropiedad.module.css";
import { EstadoCarga, EstadoError, EstadoVacio } from "../../components/Estados/Estados";
import { FormularioVisita } from "../../components/FormularioVisita/FormularioVisita";
import { FormularioConsulta } from "../../components/FormularioConsulta/FormularioConsulta";
import { GaleriaPropiedad } from "../../components/GaleriaPropiedad/GaleriaPropiedad";

export default function DetallePropiedad() {
    const { id } = useParams();
    const [propiedad, setPropiedad] = useState<PropiedadDetalleType | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [comentarios, setComentarios] = useState<ComentarioPropiedad[]>([]);

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

                const [datos, comentariosPropiedad] = await Promise.all([propiedadesService.obtener(propiedadId),
                propiedadesService.listarComentarios(propiedadId),
                ]);

                setPropiedad(datos);
                setComentarios(comentariosPropiedad);
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
                <EstadoCarga mensaje="Cargando propiedad..." />
            </section>
        );
    }

    if (error || !propiedad) {
        return (
            <section className={styles.contenedor}>
                <Link to="/" className={styles.volver}>
                    ← Volver
                </Link>
                <EstadoError mensaje={error ?? "Propiedad no encontrada."} />
            </section>
        );
    }

    const esTerreno = propiedad.tipo === "TERRENO";

    return (
        <section className={styles.contenedor}>
            <div className={styles.encabezado}>
                <Link to="/" className={styles.volver}>
                    ← Volver a propiedades
                </Link>
            </div>

            <GaleriaPropiedad
                key={propiedad.id}
                titulo={propiedad.titulo}
                fotos={propiedad.fotos}
                fotoPortada={propiedad.fotoPortada} />

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

            {propiedad.inmobiliaria && (
                <div className={styles.seccion}>
                    <h2>Inmobiliaria</h2>
                    <Link
                        to={`/inmobiliarias/${propiedad.inmobiliaria.id}`}
                        className={styles.verInmobiliaria}>
                        Ver {propiedad.inmobiliaria.nombre}
                    </Link>
                </div>
            )}

            {propiedad.estado === "PUBLICADA" && (
                <FormularioVisita propiedadId={propiedad.id} />
            )}

            <div className={styles.seccion}>
                <h2>Consultas</h2>
                {comentarios.length === 0 ? (
                    <EstadoVacio mensaje="Todavía no hay consultas sobre esta propiedad." />
                ) : (
                    <div className={styles.comentarios}>
                        {comentarios.map((comentario) => (
                            <article
                                key={comentario.id}
                                className={styles.comentario}>
                                <div className={styles.encabezadoComentario}>
                                    <strong>{comentario.nombreAutor}</strong>
                                    <span>
                                        {new Date(comentario.creadoEn).toLocaleDateString("es-AR")}
                                    </span>
                                </div>
                                <p>{comentario.contenido}</p>
                                {comentario.respuesta && (
                                    <div className={styles.respuesta}>
                                        <strong>Respuesta del vendedor</strong>
                                        <p>{comentario.respuesta}</p>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
                <FormularioConsulta propiedadId={propiedad.id}
                    onConsultaCreada={(nuevaConsulta) =>
                        setComentarios((anteriores) => [
                            ...anteriores,
                            nuevaConsulta,
                        ])
                    } />
            </div>
        </section>
    );
}