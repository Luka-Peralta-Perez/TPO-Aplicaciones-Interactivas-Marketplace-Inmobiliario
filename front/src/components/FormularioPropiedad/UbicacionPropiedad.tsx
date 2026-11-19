import type { FormularioPropiedadHook } from "../../hooks/useFormularioPropiedad";
import styles from "./FormularioPropiedad.module.css";

type Props = {
    formulario: FormularioPropiedadHook;
};

export function UbicacionPropiedad({ formulario }: Props) {
    const {
        direccion, setDireccion,
        zona, setZona,
        errores,
    } = formulario;

    return (
        <div className={styles.seccion}>
            <h2>Ubicación</h2>

            <div className={styles.grilla}>
                <div className={styles.campo}>
                    <label htmlFor="direccion">
                        Dirección
                    </label>
                    <input
                        id="direccion"
                        type="text"
                        value={direccion}
                        onChange={(event) => setDireccion(event.target.value)}
                        maxLength={255}
                        required />

                    {errores.direccion && (
                        <p className={styles.error}>
                            {errores.direccion}
                        </p>
                    )}
                </div>

                <div className={styles.campo}>
                    <label htmlFor="zona">
                        Zona
                    </label>
                    <input
                        id="zona"
                        type="text"
                        value={zona}
                        onChange={(event) => setZona(event.target.value)}
                        maxLength={120}
                        required />

                    {errores.zona && (
                        <p className={styles.error}>
                            {errores.zona}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}