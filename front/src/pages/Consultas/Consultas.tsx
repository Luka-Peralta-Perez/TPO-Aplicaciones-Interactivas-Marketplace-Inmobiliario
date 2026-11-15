import { useEffect, useState } from "react";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import { comentariosService } from "../../services/comentarios";
import type { ComentarioPropiedad, PropiedadPanel } from "../../types";

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
            <section>
                <p>Cargando consultas...</p>
            </section>
        );
    }

    return (
        <section>
            <h1>Consultas recibidas</h1>
            {error && <p>{error}</p>}
            {grupos.length === 0 ? (
                <p>No hay consultas recibidas.</p>
            ) : (
                grupos.map((grupo) => (
                    <section key={grupo.propiedad.id}>
                        <h2>{grupo.propiedad.titulo}</h2>
                        {grupo.comentarios.map((comentario) => (
                            <article key={comentario.id}>
                                <p>
                                    <strong>{comentario.nombreAutor}</strong>
                                    {" — "}
                                    {new Date(comentario.creadoEn).toLocaleDateString("es-AR")}
                                </p>
                                <p>{comentario.contenido}</p>
                                {comentario.respuesta ? (
                                    <div>
                                        <p>
                                            <strong>Respondida ✓</strong>
                                        </p>
                                        <p>
                                            <strong>Respuesta:</strong>
                                            {" "}
                                            {comentario.respuesta}
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p>
                                            <strong>Pendiente</strong>
                                        </p>
                                        <textarea
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
                                            <p>{errorRespuesta[comentario.id]}</p>
                                        )}
                                        <button
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