import { useState } from "react";
import { ApiError } from "../../comun/api";
import { comentariosService } from "../../services/comentarios";
import type { ComentarioPropiedad } from "../../types";
import styles from "./TarjetaConsulta.module.css";

type Props = {
    comentario: ComentarioPropiedad;
    onRespondida: (comentarioId: number, respuesta: string) => void;
};

export function TarjetaConsulta({ comentario, onRespondida }: Props) {
    const [respuesta, setRespuesta] = useState("");
    const [respondiendo, setRespondiendo] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function responderComentario() {
        const respuestaLimpia = respuesta.trim();

        if (!respuestaLimpia) {
            setError("La respuesta no puede estar vacía.");
            return;
        }

        try {
            setRespondiendo(true);
            setError(null);

            await comentariosService.responder(comentario.id, respuestaLimpia);
            onRespondida(comentario.id, respuestaLimpia);
            setRespuesta("");
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("No se pudo responder la consulta.");
            }
        } finally {
            setRespondiendo(false);
        }
    }

    return (
        <article
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
                        <strong>Respuesta:</strong>{" "}
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
                        value={respuesta}
                        onChange={(event) => setRespuesta(event.target.value)} />

                    {error && (
                        <p className={styles.error}>
                            {error}
                        </p>
                    )}

                    <button
                        className={styles.boton}
                        type="button"
                        disabled={respondiendo}
                        onClick={() => void responderComentario()}>
                        {respondiendo ? "Enviando..." : "Responder"}
                    </button>
                </div>
            )}
        </article>
    );
}