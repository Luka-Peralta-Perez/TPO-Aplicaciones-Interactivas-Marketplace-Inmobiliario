import { useEffect, useState } from "react";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import { comentariosService } from "../../services/comentarios";
import type { ComentarioPropiedad, PropiedadPanel } from "../../types";
import styles from "./Consultas.module.css"
import { useSearchParams } from "react-router-dom";

type GrupoConsultas = {
    propiedad: PropiedadPanel;
    comentarios: ComentarioPropiedad[];
};

export default function Consultas() {
    const [grupos, setGrupos] = useState<GrupoConsultas[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [respuestas, setRespuestas] = useState<Record<number, string>>({});
    const [respondiendoId, setRespondiendoId] = useState<number | null>(null);
    const [errorRespuesta, setErrorRespuesta] = useState<Record<number, string>>({});
    const [searchParams] = useSearchParams();
    const comentarioOrigen = searchParams.get("comentario");

    useEffect(() => {
        async function cargarConsultas() {
            try {
                setCargando(true);
                setError(null);

                const propiedades = await propiedadesService.listarPropias();
                const gruposConComentarios = await Promise.all(propiedades.map(
                    async (propiedad) => {
                        const comentarios = await propiedadesService.listarComentarios(propiedad.id);
                        return { propiedad, comentarios };
                    }
                ));

                setGrupos(gruposConComentarios.filter(
                    (grupo) => grupo.comentarios.length > 0
                ));
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudieron cargar las consultas.");
                }
            } finally {
                setCargando(false);
            }
        }
        cargarConsultas();
    }, []);

    useEffect(() => {
        if (cargando || !comentarioOrigen) {
            return;
        }

        const elemento = document.getElementById(`comentario-${comentarioOrigen}`);

        elemento?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, [cargando, comentarioOrigen]);

    async function responderComentario(comentarioId: number) {
        const respuesta = respuestas[comentarioId]?.trim();

        if (!respuesta) {
            setErrorRespuesta((anteriores) => ({
                ...anteriores,
                [comentarioId]: "La respuesta no puede estar vacía.",
            }));
            return;
        }

        try {
            setRespondiendoId(comentarioId);
            setError(null);
            setErrorRespuesta((anteriores) => ({
                ...anteriores,
                [comentarioId]: "",
            }));

            await comentariosService.responder(comentarioId, respuesta);

            setGrupos((anteriores) => anteriores.map((grupo) => ({
                ...grupo,
                comentarios: grupo.comentarios.map((comentario) =>
                    comentario.id === comentarioId ? {
                        ...comentario,
                        respuesta,
                    }
                        : comentario
                ),
            })));

            setRespuestas((anteriores) => {
                const nuevas = { ...anteriores };
                delete nuevas[comentarioId];
                return nuevas;
            });
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("No se pudo responder la consulta.");
            }
        } finally {
            setRespondiendoId(null);
        }
    }

    if (cargando) {
        return (
            <section className={styles.contenedor}>
                <p className={styles.vacio}>
                    Cargando consultas...
                </p>
            </section>
        );
    }

    return (
        <section className={styles.contenedor}>
            <h1 className={styles.titulo}>
                Consultas recibidas
            </h1>
            {error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}
            {grupos.length === 0 ? (
                <p className={styles.vacio}>
                    No hay consultas recibidas.
                </p>
            ) : (
                grupos.map((grupo) => (
                    <section key={grupo.propiedad.id}
                        className={styles.grupoPropiedad}>
                        <h2 className={styles.tituloPropiedad}>
                            {grupo.propiedad.titulo}
                        </h2>
                        {grupo.comentarios.map((comentario) => (
                            <article
                                key={comentario.id}
                                id={`comentario-${comentario.id}`}
                                className={styles.tarjeta}>
                                <div className={styles.encabezadoConsulta}>
                                    <strong>{comentario.nombreAutor}</strong>
                                    <span className={styles.fecha}>
                                        {new Date(comentario.creadoEn).toLocaleDateString("es-AR")}
                                    </span>
                                </div>
                                <p>{comentario.contenido}</p>
                                {comentario.respuesta ? (
                                    <div className={styles.respuesta}>
                                        <span className={styles.estadoRespondida}>
                                            Respondida ✓
                                        </span>
                                        <p>
                                            <strong>Respuesta:</strong>
                                            {" "}
                                            {comentario.respuesta}
                                        </p>
                                    </div>
                                ) : (
                                    <div className={styles.formRespuesta}>
                                        <span className={styles.estadoPendiente}>
                                            Pendiente
                                        </span>
                                        <textarea
                                            className={styles.textarea}
                                            rows={3}
                                            placeholder="Escribir respuesta..."
                                            value={respuestas[comentario.id] ?? ""}
                                            onChange={(event) => setRespuestas((anteriores) => ({
                                                ...anteriores,
                                                [comentario.id]: event.target.value,
                                            }))
                                            }
                                        />
                                        {errorRespuesta[comentario.id] && (
                                            <p className={styles.error}>
                                                {errorRespuesta[comentario.id]}
                                            </p>
                                        )}
                                        <button
                                            className={styles.boton}
                                            type="button"
                                            disabled={respondiendoId === comentario.id}
                                            onClick={() => responderComentario(comentario.id)}>
                                            {respondiendoId === comentario.id ? "Enviando..." : "Responder"}
                                        </button>
                                    </div>
                                )}
                            </article>
                        )
                        )}
                    </section>
                ))
            )}

        </section>
    );
}