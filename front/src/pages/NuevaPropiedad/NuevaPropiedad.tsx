import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import styles from "./NuevaPropiedad.module.css";
import { useFormularioPropiedad } from "../../hooks/useFormularioPropiedad";
import { FormularioPropiedad } from "../../components/FormularioPropiedad/FormularioPropiedad";

export default function NuevaPropiedad() {
    const navigate = useNavigate();

    const formulario = useFormularioPropiedad();

    const {
        validarFormulario,
        obtenerDatos,
    } = formulario;

    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function manejarSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError(null);

        if (!validarFormulario()) {
            return;
        }

        const datos = obtenerDatos();

        try {
            setGuardando(true);

            await propiedadesService.crear(datos);

            navigate("/panel/propiedades");
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("No se pudo crear la propiedad");
            }
        } finally {
            setGuardando(false);
        }
    }

    return (
        <section className={styles.contenedor}>
            <div className={styles.encabezado}>
                <div>
                    <h1>Nueva propiedad</h1>
                    <p>
                        Completá los datos de la propiedad.
                        Se guardará inicialmente como BORRADOR.
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.botonSecundario}
                    onClick={() => navigate("/panel/propiedades")}
                >
                    Volver
                </button>
            </div>

            <FormularioPropiedad
                formulario={formulario}
                onSubmit={manejarSubmit}
                onCancelar={() => navigate("/panel/propiedades")}
                guardando={guardando}
                error={error}
                textoBoton="Crear propiedad"
                textoFotos="Ingresá las URLs de las imágenes y elegí una como portada."
            />
        </section>
    );
}