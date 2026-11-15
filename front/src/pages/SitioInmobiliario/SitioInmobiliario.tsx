import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError} from "../../comun/api";
import { inmobiliariasService } from "../../services/inmobiliarias";
import type { InmobiliariaDatos, PropiedadPublica, ReseniaPublica } from "../../types";
import styles from "./SitioInmobiliario.module.css"

export default function SitioInmobiliario() {
    const { id } = useParams();

    const [inmobiliaria, setInmobiliaria] = useState<InmobiliariaDatos | null>(null);
    const [propiedades, setPropiedades] = useState<PropiedadPublica[]>([]);
    const [resenias, setResenias] = useState<ReseniaPublica[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nombreAutor, setNombreAutor] = useState("");
    const [contenido, setContenido] = useState("");
    const [calificacion, setCalificacion] = useState(5);
    const [enviando, setEnviando] = useState(false);
    const [errorResenia, setErrorResenia] = useState<string | null>(null);

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

    async function enviarResenia(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!inmobiliaria) {
            return;
        }
        setErrorResenia(null);

        if (!nombreAutor.trim()) {
            setErrorResenia("Ingresá tu nombre.");
            return;
        }

        if (!contenido.trim()) {
            setErrorResenia("La reseña no puede estar vacía.");
            return;
        }

        if (calificacion < 1 || calificacion > 5) {
            setErrorResenia("La calificación debe ser entre 1 y 5.");
            return;
        }

        try {
            setEnviando(true);
            const nuevaResenia = await inmobiliariasService.crearResenia(inmobiliaria.id, {
                nombreAutor: nombreAutor.trim(),
                contenido: contenido.trim(),
                calificacion,
            });
            setResenias((anteriores) => [
                ...anteriores,
                nuevaResenia,
            ]);
            setNombreAutor("");
            setContenido("");
            setCalificacion(5);
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorResenia(error.message);
            } else {
                setErrorResenia("No se pudo enviar la reseña");
            }
        } finally {
            setEnviando(false);
        }
    }
    if (cargando) {
        return (
            <section
                className={styles.contenedor}>
                <p>Cargando inmobiliaria...</p>
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
                <p className={styles.error}>
                    {error ?? "Inmobiliaria no encontrada."}
                </p>
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
                    <p>Esta inmobiliaria no tiene propiedades publicadas</p>
                ) : (
                    <div className={styles.propiedades}>
                        {propiedades.map((propiedad) => (
                            <article
                                key={propiedad.id}
                                className={styles.tarjeta}>
                                <img
                                    src={propiedad.fotoPortada}
                                    alt={propiedad.titulo} />

                                <div className={styles.contenidoTarjeta}>
                                    <span>{propiedad.operacion}</span>
                                    <h3>{propiedad.titulo}</h3>
                                    <p>{propiedad.zona}</p>
                                    <strong>
                                        {propiedad.moneda}{" "}
                                        {Number(propiedad.precio).toLocaleString("es-AR")}
                                    </strong>
                                    <Link to={`/propiedades/${propiedad.id}`}>
                                        Ver propiedad
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.seccion}>
                <h2>Reseñas</h2>
                {resenias.length === 0 ? (
                    <p>Esta inmobiliaria todavía no tiene reseñas.</p>
                ) : (
                    <div className={styles.resenias}>
                        {resenias.map((resenia) => (
                            <article
                                key={resenia.id}
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

                <form className={styles.formResenia}
                    onSubmit={enviarResenia}>
                    <h3>Dejar una reseña</h3>
                    <div className={styles.campo}>
                        <label htmlFor="nombreAutor">
                            Nombre
                        </label>
                        <input
                            id="nombreAutor"
                            value={nombreAutor}
                            onChange={(event) => setNombreAutor(event.target.value)} />
                    </div>

                    <div className={styles.campo}>
                        <label htmlFor="calificacion">
                            Calificación
                        </label>
                        <select
                            id="calificacion"
                            value={calificacion}
                            onChange={(event) => setCalificacion(Number(event.target.value))}>
                            <option value={5}>
                                5 - Excelente
                            </option>
                            <option value={4}>
                                4 - Muy buena
                            </option>
                            <option value={3}>
                                3 - Buena
                            </option>
                            <option value={2}>
                                2 - Regular
                            </option>
                            <option value={1}>
                                1 - Mala
                            </option>
                        </select>
                    </div>

                    <div className={styles.campo}>
                        <label htmlFor="contenido">
                            Reseña
                        </label>
                        <textarea
                            id="contenido"
                            rows={4}
                            value={contenido}
                            onChange={(event) => setContenido(event.target.value)} />
                    </div>

                    {errorResenia && (
                        <p className={styles.error}>
                            {errorResenia}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={enviando}>
                        {enviando ? "Enviando..." : "Enviar reseña"}
                    </button>
                </form>

            </div>
        </section>
    );
}