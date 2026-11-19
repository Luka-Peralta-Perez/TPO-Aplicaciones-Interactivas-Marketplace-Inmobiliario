import { useState, type FormEvent } from "react";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import styles from "./FormularioVisita.module.css";

type ErroresVisita = {
    nombreVisita?: string;
    telefonoVisita?: string;
    fechaVisita?: string;
};

type Props = {
    propiedadId: number;
};

export function FormularioVisita({ propiedadId, }: Props) {
    const [nombreVisita, setNombreVisita] = useState("");
    const [telefonoVisita, setTelefonoVisita] = useState("");
    const [fechaVisita, setFechaVisita] = useState("");
    const [mensajeVisita, setMensajeVisita] = useState("");
    const [enviandoVisita, setEnviandoVisita] = useState(false);
    const [errorVisita, setErrorVisita] = useState<string | null>(null);
    const [exitoVisita, setExitoVisita] = useState<string | null>(null);
    const [mostrarFormularioVisita, setMostrarFormularioVisita] = useState(false);
    const [erroresVisita, setErroresVisita] = useState<ErroresVisita>({});

    async function enviarSolicitudVisita(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

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

            if (
                Number.isNaN(fechaSeleccionada.getTime()) ||
                fechaSeleccionada <= new Date()
            ) {
                nuevosErrores.fechaVisita = "La fecha de la visita debe ser futura.";
            }
        }

        if (
            Object.keys(nuevosErrores).length > 0
        ) {
            setErroresVisita(nuevosErrores);
            return;
        }

        const fechaSeleccionada = new Date(fechaVisita);

        try {
            setEnviandoVisita(true);

            await propiedadesService.crearSolicitudVisita(
                propiedadId,
                {
                    nombreSolicitante: nombreVisita.trim(),
                    telefono: telefonoVisita.trim(),
                    fechaPropuesta: fechaSeleccionada.toISOString(),
                    mensaje:
                        mensajeVisita.trim() || undefined,
                }
            );

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

    return (
        <div className={styles.seccion}>
            <button
                type="button"
                className={styles.botonSecundario}
                onClick={() =>
                    setMostrarFormularioVisita((anterior) => !anterior)
                }>
                {mostrarFormularioVisita
                    ? "Cerrar formulario"
                    : "Pedir visita"}
            </button>

            {mostrarFormularioVisita && (
                <form
                    className={styles.formConsulta}
                    onSubmit={enviarSolicitudVisita}
                    noValidate
                >
                    <div
                        className={styles.campoConsulta}
                    >
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

                    <div
                        className={styles.campoConsulta}
                    >
                        <label htmlFor="fechaVisita">
                            Fecha y hora
                        </label>

                        <input
                            id="fechaVisita"
                            type="datetime-local"
                            value={fechaVisita}
                            min={new Date(
                                Date.now() -
                                new Date().getTimezoneOffset() *
                                60000
                            )
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
                        className={styles.botonPrincipal}
                        disabled={enviandoVisita}>
                        {enviandoVisita
                            ? "Enviando..."
                            : "Pedir visita"}
                    </button>
                </form>
            )}
        </div>
    );
}