import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { PropiedadDetalle as PropiedadDetalleType, ComentarioPropiedad } from "../../types";
import styles from "./DetallePropiedad.module.css";
import { EstadoCarga, EstadoError, EstadoVacio } from "../../components/Estados/Estados";

type ErroresConsulta = {
    nombreAutor?: string;
    contenidoConsulta?: string;
};

type ErroresVisita = {
    nombreVisita?: string;
    telefonoVisita?: string;
    fechaVisita?: string;
};

export default function DetallePropiedad() {
    const { id } = useParams();
    const [propiedad, setPropiedad] = useState<PropiedadDetalleType | null>(null);
    const [fotoSeleccionada, setFotoSeleccionada] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [comentarios, setComentarios] = useState<ComentarioPropiedad[]>([]);
    const [nombreAutor, setNombreAutor] = useState("");
    const [contenidoConsulta, setContenidoConsulta] = useState("");
    const [enviandoConsulta, setEnviandoConsulta] = useState(false);
    const [errorConsulta, setErrorConsulta] = useState<string | null>(null);

    const [nombreVisita, setNombreVisita] = useState("");
    const [telefonoVisita, setTelefonoVisita] = useState("");
    const [fechaVisita, setFechaVisita] = useState("");
    const [mensajeVisita, setMensajeVisita] = useState("");
    const [enviandoVisita, setEnviandoVisita] = useState(false);
    const [errorVisita, setErrorVisita] = useState<string | null>(null);
    const [exitoVisita, setExitoVisita] = useState<string | null>(null);
    const [mostrarFormularioVisita, setMostrarFormularioVisita] = useState(false);

    const [erroresConsulta, setErroresConsulta] = useState<ErroresConsulta>({});
    const [erroresVisita, setErroresVisita] = useState<ErroresVisita>({});

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

    async function enviarConsulta(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!propiedad) {
            return;
        }

        setErroresConsulta({});
        setErrorConsulta(null);

        const nuevosErrores: ErroresConsulta = {};

        if (!nombreAutor.trim()) {
            nuevosErrores.nombreAutor = "Ingresá tu nombre.";
        }

        if (!contenidoConsulta.trim()) {
            nuevosErrores.contenidoConsulta = "La consulta no puede estar vacía.";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresConsulta(nuevosErrores);
            return;
        }

        try {
            setEnviandoConsulta(true);

            const nuevaConsulta = await propiedadesService.crearComentario(propiedad.id, {
                nombreAutor: nombreAutor.trim(),
                contenido: contenidoConsulta.trim(),
            });

            setComentarios((anteriores) => [...anteriores, nuevaConsulta]);
            setNombreAutor("");
            setContenidoConsulta("");
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorConsulta(error.message);
            } else {
                setErrorConsulta("No se pudo enviar la consulta.")
            }
        } finally {
            setEnviandoConsulta(false);
        }
    }

    async function enviarSolicitudVisita(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!propiedad) {
            return;
        }
        setErroresVisita({});
        setErrorVisita(null);
        setExitoVisita(null);

        const nuevosErrores: ErroresVisita = {};

        if (!nombreVisita.trim()) {
            nuevosErrores.nombreVisita = "Ingresá tu nombre.";
        }

        if (!telefonoVisita.trim()) {
            nuevosErrores.telefonoVisita = "Ingresá tu teléfono.";
        }

        if (!fechaVisita) {
            nuevosErrores.fechaVisita = "Seleccioná una fecha y hora.";
        } else {
            const fechaSeleccionada = new Date(fechaVisita);

            if (Number.isNaN(fechaSeleccionada.getTime()) ||
                fechaSeleccionada <= new Date()
            ) {
                nuevosErrores.fechaVisita = "La fecha de la visita debe ser futura.";
            }
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresVisita(nuevosErrores);
            return;
        }

        const fechaSeleccionada = new Date(fechaVisita);

        try {
            setEnviandoVisita(true);
            await propiedadesService.crearSolicitudVisita(propiedad.id, {
                nombreSolicitante: nombreVisita.trim(),
                telefono: telefonoVisita.trim(),
                fechaPropuesta: fechaSeleccionada.toISOString(),
                mensaje: mensajeVisita.trim() || undefined,
            });
            setNombreVisita("");
            setTelefonoVisita("");
            setFechaVisita("");
            setMensajeVisita("");
            setExitoVisita("La solicitud de visita fue enviada correctamente.");
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorVisita(error.message);
            } else {
                setErrorVisita("No se pudo enviar la solicitud de visita");
            }
        } finally {
            setEnviandoVisita(false);
        }
    }


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
                <Link to="/">← Volver</Link>
                <EstadoError mensaje={error ?? "Propiedad no encontrada."} />
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

            {propiedad.inmobiliaria && (
                <div className={styles.seccion}>
                    <h2>Inmobiliaria</h2>
                    <Link
                        to={`/inmobiliarias/${propiedad.inmobiliaria.id}`}>
                        Ver {propiedad.inmobiliaria.nombre}
                    </Link>
                </div>
            )}

            {propiedad.estado === "PUBLICADA" && (
                <div className={styles.seccion}>
                    <button
                        type="button"
                        onClick={() => setMostrarFormularioVisita((anterior) => !anterior)}>
                        {mostrarFormularioVisita ? "Cerrar formulario" : "Pedir visita"}
                    </button>
                    {mostrarFormularioVisita && (
                        <form className={styles.formConsulta}
                            onSubmit={enviarSolicitudVisita}
                            noValidate>
                            <div className={styles.campoConsulta}>
                                <label htmlFor="nombreVisita">
                                    Nombre
                                </label>
                                <input
                                    id="nombreVisita"
                                    type="text"
                                    value={nombreVisita}
                                    onChange={(event) => setNombreVisita(event.target.value)} />

                                {erroresVisita.nombreVisita && (
                                    <p className={styles.errorConsulta}>
                                        {erroresVisita.nombreVisita}
                                    </p>
                                )}
                            </div>

                            <div className={styles.campoConsulta}>
                                <label htmlFor="telefonoVisita">
                                    Teléfono
                                </label>
                                <input
                                    id="telefonoVisita"
                                    type="tel"
                                    value={telefonoVisita}
                                    onChange={(event) => setTelefonoVisita(event.target.value)} />

                                {erroresVisita.telefonoVisita && (
                                    <p className={styles.errorConsulta}>
                                        {erroresVisita.telefonoVisita}
                                    </p>
                                )}
                            </div>

                            <div className={styles.campoConsulta}>
                                <label htmlFor="fechaVisita">
                                    Fecha y hora
                                </label>
                                <input
                                    id="fechaVisita"
                                    type="datetime-local"
                                    value={fechaVisita}
                                    min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                                        .toISOString()
                                        .slice(0, 16)}
                                    onChange={(event) => setFechaVisita(event.target.value)} />

                                {erroresVisita.fechaVisita && (
                                    <p className={styles.errorConsulta}>
                                        {erroresVisita.fechaVisita}
                                    </p>
                                )}
                            </div>

                            <div className={styles.campoConsulta}>
                                <label htmlFor="mensajeVisita">
                                    Mensaje (opcional)
                                </label>
                                <textarea
                                    id="mensajeVisita"
                                    rows={4}
                                    value={mensajeVisita}
                                    onChange={(event) => setMensajeVisita(event.target.value)} />
                            </div>

                            {errorVisita && (
                                <p className={styles.errorConsulta}>
                                    {errorVisita}
                                </p>
                            )}
                            {exitoVisita && (
                                <p className={styles.exitoVisita}>
                                    {exitoVisita}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={enviandoVisita}>
                                {enviandoVisita ? "Enviando..." : "Pedir visita"}
                            </button>
                        </form>
                    )}
                </div>
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
                <form
                    className={styles.formConsulta}
                    onSubmit={enviarConsulta}
                    noValidate>
                    <h3>Dejar una consulta</h3>
                    <div className={styles.campoConsulta}>
                        <label htmlFor="nombreAutor">
                            Nombre
                        </label>
                        <input
                            id="nombreAutor"
                            type="text"
                            value={nombreAutor}
                            onChange={(event) => setNombreAutor(event.target.value)} />

                        {erroresConsulta.nombreAutor && (
                            <p className={styles.errorConsulta}>
                                {erroresConsulta.nombreAutor}
                            </p>
                        )}
                    </div>

                    <div className={styles.campoConsulta}>
                        <label htmlFor="consulta">
                            Consulta
                        </label>
                        <textarea
                            id="consulta"
                            rows={4}
                            value={contenidoConsulta}
                            onChange={(event) => setContenidoConsulta(event.target.value)} />

                            {erroresConsulta.contenidoConsulta && (
                            <p className={styles.errorConsulta}>
                                {erroresConsulta.contenidoConsulta}
                            </p>
                        )}
                    </div>

                    {errorConsulta && (
                        <p className={styles.errorConsulta}>
                            {errorConsulta}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={enviandoConsulta}>
                        {enviandoConsulta ? "Enviando..." : "Enviar consulta"}
                    </button>
                </form>
            </div>
        </section>
    );
}