import type { FormEventHandler } from "react";
import type { FormularioPropiedadHook } from "../../hooks/useFormularioPropiedad";
import styles from "./FormularioPropiedad.module.css";
import { InformacionPrincipalPropiedad } from "./InformacionPrincipalPropiedad";
import { UbicacionPropiedad } from "./UbicacionPropiedad";
import { CaracteristicasPropiedad } from "./CaracteristicasPropiedad";
import { AmenitiesPropiedad } from "./AmenitiesPropiedad";
import { FotosPropiedad } from "./FotosPropiedad";

type Props = {
    formulario: FormularioPropiedadHook;
    onSubmit: FormEventHandler<HTMLFormElement>;
    onCancelar: () => void;
    guardando: boolean;
    error: string | null;
    textoBoton: string;
    textoFotos: string;
};

export function FormularioPropiedad({
    formulario,
    onSubmit,
    onCancelar,
    guardando,
    error,
    textoBoton,
    textoFotos,
}: Props) {

    return (
            <form
                className={styles.formulario}
                onSubmit={onSubmit}
                noValidate>

                <InformacionPrincipalPropiedad
                    formulario={formulario} />

                <UbicacionPropiedad
                    formulario={formulario} />

                <CaracteristicasPropiedad
                    formulario={formulario} />

                <AmenitiesPropiedad
                    formulario={formulario} />

                <FotosPropiedad
                    formulario={formulario}
                    textoFotos={textoFotos} />

                {error && (
                    <p className={styles.error}>
                        {error}
                    </p>
                )}

                <div className={styles.acciones}>
                    <button
                        type="button"
                        className={styles.botonSecundario}
                        onClick={onCancelar}
                        disabled={guardando}>
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className={styles.botonPrincipal}
                        disabled={guardando}>
                        {guardando ? "Guardando..." : textoBoton}
                    </button>
                </div>
            </form>
    );
}