import { useState, type FormEvent } from "react";
import { ApiError } from "../../comun/api";
import { inmobiliariasService } from "../../services/inmobiliarias";
import type { ReseniaPublica } from "../../types";
import styles from "./FormularioResenia.module.css";

type ErroresResenia = {
    nombreAutor?: string;
    contenido?: string;
    calificacion?: string;
};

type Props = {
    inmobiliariaId: number;
    onReseniaCreada: (resenia: ReseniaPublica) => void;
};

export function FormularioResenia({ inmobiliariaId, onReseniaCreada }: Props) {
    const [nombreAutor, setNombreAutor] = useState("");
    const [contenido, setContenido] = useState("");
    const [calificacion, setCalificacion] = useState(5);
    const [enviando, setEnviando] = useState(false);
    const [errorResenia, setErrorResenia] = useState<string | null>(null);
    const [erroresResenia, setErroresResenia] = useState<ErroresResenia>({});

    async function enviarResenia(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErroresResenia({});
        setErrorResenia(null);

        const nuevosErrores: ErroresResenia = {};

        if (!nombreAutor.trim()) {
            nuevosErrores.nombreAutor = "Ingresá tu nombre.";
        }

        if (!contenido.trim()) {
            nuevosErrores.contenido = "La reseña no puede estar vacía.";
        }

        if (calificacion < 1 || calificacion > 5) {
            nuevosErrores.calificacion = "La calificación debe ser entre 1 y 5.";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresResenia(nuevosErrores);
            return;
        }

        try {
            setEnviando(true);

            const nuevaResenia = await inmobiliariasService.crearResenia(inmobiliariaId, {
                nombreAutor: nombreAutor.trim(),
                contenido: contenido.trim(),
                calificacion,
            });

            onReseniaCreada(nuevaResenia);
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

    return (
        <form className={styles.formResenia} onSubmit={enviarResenia} noValidate>
            <h3>Dejar una reseña</h3>

            <div className={styles.campo}>
                <label htmlFor="nombreAutor">Nombre</label>
                <input
                    id="nombreAutor"
                    value={nombreAutor}
                    onChange={(event) => setNombreAutor(event.target.value)} />

                {erroresResenia.nombreAutor && (
                    <p className={styles.error}>
                        {erroresResenia.nombreAutor}
                    </p>
                )}
            </div>

            <div className={styles.campo}>
                <label htmlFor="calificacion">Calificación</label>
                <select
                    id="calificacion"
                    value={calificacion}
                    onChange={(event) => setCalificacion(Number(event.target.value))}>
                    <option value={5}>5 - Excelente</option>
                    <option value={4}>4 - Muy buena</option>
                    <option value={3}>3 - Buena</option>
                    <option value={2}>2 - Regular</option>
                    <option value={1}>1 - Mala</option>
                </select>

                {erroresResenia.calificacion && (
                    <p className={styles.error}>
                        {erroresResenia.calificacion}
                    </p>
                )}
            </div>

            <div className={styles.campo}>
                <label htmlFor="contenido">Reseña</label>
                <textarea
                    id="contenido"
                    rows={4}
                    value={contenido}
                    onChange={(event) => setContenido(event.target.value)} />

                {erroresResenia.contenido && (
                    <p className={styles.error}>
                        {erroresResenia.contenido}
                    </p>
                )}
            </div>

            {errorResenia && (
                <p className={styles.error}>
                    {errorResenia}
                </p>
            )}

            <button
                type="submit"
                className={styles.botonPrincipal}
                disabled={enviando}>
                {enviando ? "Enviando..." : "Enviar reseña"}
            </button>
        </form>
    );
}