import { useState, type FormEvent } from "react";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { ComentarioPropiedad } from "../../types";
import styles from "./FormularioConsulta.module.css";
type ErroresConsulta = {
    nombreAutor?: string;
    contenidoConsulta?: string;
};

type Props = {
    propiedadId: number;
    onConsultaCreada: (consulta: ComentarioPropiedad) => void;
};

export function FormularioConsulta({ propiedadId, onConsultaCreada, }: Props) {
    const [nombreAutor, setNombreAutor] = useState("");
    const [contenidoConsulta, setContenidoConsulta] = useState("");
    const [enviandoConsulta, setEnviandoConsulta] = useState(false);
    const [errorConsulta, setErrorConsulta] = useState<string | null>(null);
    const [erroresConsulta, setErroresConsulta] = useState<ErroresConsulta>({});

    async function enviarConsulta(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErroresConsulta({});
        setErrorConsulta(null);

        const nuevosErrores: ErroresConsulta = {};

        if (!nombreAutor.trim()) {
            nuevosErrores.nombreAutor = "Ingresá tu nombre.";
        }

        if (!contenidoConsulta.trim()) {
            nuevosErrores.contenidoConsulta = "La consulta no puede estar vacía.";
        }

        if (
            Object.keys(nuevosErrores).length > 0
        ) {
            setErroresConsulta(nuevosErrores);
            return;
        }

        try {
            setEnviandoConsulta(true);

            const nuevaConsulta = await propiedadesService.crearComentario(
                propiedadId, {
                nombreAutor: nombreAutor.trim(),
                contenido: contenidoConsulta.trim(),
            }
            );

            onConsultaCreada(nuevaConsulta);

            setNombreAutor("");
            setContenidoConsulta("");
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorConsulta(error.message);
            } else {
                setErrorConsulta("No se pudo enviar la consulta.");
            }
        } finally {
            setEnviandoConsulta(false);
        }
    }

    return (
        <form
            className={styles.formConsulta}
            onSubmit={enviarConsulta}
            noValidate
        >
            <h3>Dejar una consulta</h3>

            <div className={styles.campoConsulta}>
                <label htmlFor="nombreAutor">
                    Nombre
                </label>

                <input
                    id="nombreAutor"
                    type="text"
                    value={nombreAutor}
                    onChange={(event) =>setNombreAutor(event.target.value)}/>

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
                    onChange={(event) => setContenidoConsulta(event.target.value)}
                />

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
                disabled={enviandoConsulta}
            >
                {enviandoConsulta
                    ? "Enviando..."
                    : "Enviar consulta"}
            </button>
        </form>
    );
}