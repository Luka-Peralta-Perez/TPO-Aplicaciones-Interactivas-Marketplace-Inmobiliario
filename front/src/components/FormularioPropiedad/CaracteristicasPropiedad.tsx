import type { FormularioPropiedadHook } from "../../hooks/useFormularioPropiedad";
import styles from "./FormularioPropiedad.module.css";

type Props = {
    formulario: FormularioPropiedadHook;
};

export function CaracteristicasPropiedad({ formulario }: Props) {
    const {
        tipo,
        superficieCubiertaM2, setSuperficieCubiertaM2,
        superficieTotalM2, setSuperficieTotalM2,
        ambientes, setAmbientes,
        dormitorios, setDormitorios,
        banios, setBanios,
        antiguedadAnios, setAntiguedadAnios,
        errores,
    } = formulario;

    return (
        <div className={styles.seccion}>
            <h2>Características</h2>

            <div className={styles.grilla}>
                <div className={styles.campo}>
                    <label htmlFor="superficieTotal">
                        Superficie total (m²)
                    </label>
                    <input
                        id="superficieTotal"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={superficieTotalM2}
                        onChange={(event) => setSuperficieTotalM2(event.target.value)}
                        required />

                    {errores.superficieTotalM2 && (
                        <p className={styles.error}>
                            {errores.superficieTotalM2}
                        </p>
                    )}
                </div>

                {tipo !== "TERRENO" && (
                    <>
                        <div className={styles.campo}>
                            <label htmlFor="superficieCubierta">
                                Superficie cubierta (m²)
                            </label>
                            <input
                                id="superficieCubierta"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={superficieCubiertaM2}
                                onChange={(event) => setSuperficieCubiertaM2(event.target.value)} />

                            {errores.superficieCubiertaM2 && (
                                <p className={styles.error}>
                                    {errores.superficieCubiertaM2}
                                </p>
                            )}
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="ambientes">
                                Ambientes
                            </label>
                            <input
                                id="ambientes"
                                type="number"
                                min="1"
                                value={ambientes}
                                onChange={(event) => setAmbientes(event.target.value)} />

                            {errores.ambientes && (
                                <p className={styles.error}>
                                    {errores.ambientes}
                                </p>
                            )}
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="dormitorios">
                                Dormitorios
                            </label>
                            <input
                                id="dormitorios"
                                type="number"
                                min="1"
                                value={dormitorios}
                                onChange={(event) => setDormitorios(event.target.value)} />

                            {errores.dormitorios && (
                                <p className={styles.error}>
                                    {errores.dormitorios}
                                </p>
                            )}
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="banios">
                                Baños
                            </label>
                            <input
                                id="banios"
                                type="number"
                                min="1"
                                value={banios}
                                onChange={(event) => setBanios(event.target.value)} />

                            {errores.banios && (
                                <p className={styles.error}>
                                    {errores.banios}
                                </p>
                            )}
                        </div>
                    </>
                )}

                <div className={styles.campo}>
                    <label htmlFor="antiguedad">
                        Antigüedad
                    </label>
                    <input
                        id="antiguedad"
                        type="number"
                        min="0"
                        value={antiguedadAnios}
                        onChange={(event) => setAntiguedadAnios(event.target.value)} />

                    {errores.antiguedadAnios && (
                        <p className={styles.error}>
                            {errores.antiguedadAnios}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}