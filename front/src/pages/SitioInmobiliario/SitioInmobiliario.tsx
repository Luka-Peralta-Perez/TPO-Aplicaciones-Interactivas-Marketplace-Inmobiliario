import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { inmobiliariasService } from "../../services/inmobiliarias";
import type { InmobiliariaDatos, PropiedadPublica, ReseniaPublica } from "../../types";
import styles from "./SitioInmobiliario.module.css";
import { EstadoCarga, EstadoError, EstadoVacio } from "../../components/Estados/Estados";
import { FormularioResenia } from "../../components/FormularioResenia/FormularioResenia";
import { TarjetaPropiedadInmobiliaria } from "../../components/TarjetaPropiedadInmobiliaria/TarjetaPropiedadInmobiliaria";

export default function SitioInmobiliario() {
    const { id } = useParams();

    const [inmobiliaria, setInmobiliaria] = useState<InmobiliariaDatos | null>(null);
    const [propiedades, setPropiedades] = useState<PropiedadPublica[]>([]);
    const [resenias, setResenias] = useState<ReseniaPublica[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const reseniaOrigen = searchParams.get("resenia");

    useEffect(() => {
        async function cargarInmobiliaria() {
            const inmobiliariaId = Number(id);

            if (!inmobiliariaId) {
                setError("La inmobiliaria indicada no es válida.");
                setCargando(false);
                return;
            }
            try {
                setCargando(true);
                setError(null);

                const [datos, respuestaPropiedades, datosResenias] = await Promise.all([
                    inmobiliariasService.obtenerPublica(inmobiliariaId),
                    inmobiliariasService.listarPropiedadesPublicas(inmobiliariaId),
                    inmobiliariasService.listarResenias(inmobiliariaId),
                ]);
                setInmobiliaria(datos);

                if (Array.isArray(respuestaPropiedades)) {
                    setPropiedades(respuestaPropiedades);
                } else {
                    setPropiedades(respuestaPropiedades.items);
                }
                setResenias(datosResenias);
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudo cargar la inmobiliaria.");
                }
            } finally {
                setCargando(false);
            }
        }
        cargarInmobiliaria();
    }, [id]);

    useEffect(() => {
        if (cargando || !reseniaOrigen) {
            return;
        }

        const elemento = document.getElementById(`resenia-${reseniaOrigen}`);

        elemento?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, [cargando, reseniaOrigen]);

    if (cargando) {
        return (
            <section
                className={styles.contenedor}>
                <EstadoCarga mensaje="Cargando inmobiliaria..." />
            </section>
        );
    }
    if (error || !inmobiliaria) {
        return (
            <section
                className={styles.contenedor}>
                <Link to="/">
                    ← Volver
                </Link>
                <EstadoError mensaje={error ?? "No se encontró la inmobiliaria."} />
            </section>
        );
    }
    const promedio = resenias.length > 0 ? resenias.reduce((total, resenia) =>
        total + resenia.calificacion, 0
    ) / resenias.length : 0;

    return (
        <section className={styles.contenedor}>
            <Link to="/">
                ← Volver a propiedades
            </Link>
            <header className={styles.perfil}>
                {inmobiliaria.logoUrl && (
                    <img
                        src={inmobiliaria.logoUrl}
                        alt={inmobiliaria.nombre}
                        className={styles.logo} />
                )}

                <div>
                    <h1>{inmobiliaria.nombre}</h1>
                    {resenias.length > 0 && (
                        <p>
                            ⭐{" "}
                            {promedio.toFixed(1)}
                            {" · "}
                            {resenias.length} reseña
                            {resenias.length !== 1 ? "s" : ""}
                        </p>
                    )}
                    <p>{inmobiliaria.descripcion}</p>
                </div>
            </header>

            <div className={styles.contacto}>
                <div>
                    <strong>
                        Teléfono
                    </strong>
                    <a href={`tel:${inmobiliaria.telefonoContacto}`}>
                        {inmobiliaria.telefonoContacto}
                    </a>
                </div>

                <div>
                    <strong>Email</strong>
                    <span>{inmobiliaria.emailContacto}</span>
                </div>

                {inmobiliaria.direccionOficina && (
                    <div>
                        <strong>Dirección</strong>
                        <span>{inmobiliaria.direccionOficina}</span>
                    </div>
                )}
            </div>

            <div className={styles.seccion}>
                <h2>Propiedades publicadas</h2>
                {propiedades.length === 0 ? (
                    <EstadoVacio mensaje="Esta inmobiliaria no tiene propiedades publicadas" />
                ) : (
                    <div className={styles.propiedades}>
                        {propiedades.map((propiedad) => (
                            <TarjetaPropiedadInmobiliaria
                                key={propiedad.id}
                                propiedad={propiedad}/>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.seccion}>
                <h2>Reseñas</h2>
                {resenias.length === 0 ? (
                    <EstadoVacio mensaje="Esta inmobiliaria todavía no tiene reseñas" />
                ) : (
                    <div className={styles.resenias}>
                        {resenias.map((resenia) => (
                            <article
                                key={resenia.id}
                                id={`resenia-${resenia.id}`}
                                className={styles.resenia}>
                                <div className={styles.encabezadoResenia}>
                                    <strong>{resenia.nombreAutor}</strong>
                                    <span>
                                        {"★".repeat(resenia.calificacion)}
                                        {"☆".repeat(5 - resenia.calificacion)}
                                    </span>
                                </div>
                                <p>{resenia.contenido}</p>
                                <small>{new Date(resenia.creadoEn).toLocaleDateString("es-AR")}</small>
                            </article>
                        ))}
                    </div>
                )}

                <FormularioResenia
                    inmobiliariaId={inmobiliaria.id}
                    onReseniaCreada={(nuevaResenia) => setResenias((anteriores) =>
                        [...anteriores, nuevaResenia])
                    } />

            </div>
        </section>
    );
}