import { useState } from "react";
import type { FormularioPropiedadHook } from "../../hooks/useFormularioPropiedad";
import { DialogoConfirmacion } from "../DialogoConfirmacion/DialogoConfirmacion";
import styles from "./FormularioPropiedad.module.css";

type Props = {
    formulario: FormularioPropiedadHook;
    textoFotos: string;
};

export function FotosPropiedad({ formulario, textoFotos }: Props) {
    const [fotoAEliminar, setFotoAEliminar] = useState<number | null>(null);

    const {
        fotos,
        fotoPortada,
        setFotoPortada,
        errores,
        actualizarFoto,
        agregarFoto,
        eliminarFoto,
        moverFoto,
    } = formulario;

    function confirmarEliminarFoto() {
        if (fotoAEliminar === null) {
            return;
        }

        eliminarFoto(fotoAEliminar);
        setFotoAEliminar(null);
    }

    return (
        <>
            <div className={styles.seccion}>
                <div className={styles.encabezadoFotos}>
                    <div>
                        <h2>Fotos</h2>
                        <p>{textoFotos}</p>
                    </div>

                    <button
                        type="button"
                        className={styles.botonSecundario}
                        onClick={agregarFoto}>
                        Agregar foto
                    </button>
                </div>

                <div className={styles.listaFotos}>
                    {fotos.map((foto, indice) => (
                        <div className={styles.foto}
                            key={indice}>
                            <div className={styles.datosFoto}>
                                <label>Foto {indice + 1}</label>

                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={foto}
                                    onChange={(event) => actualizarFoto(indice, event.target.value)} />

                                <label className={styles.portada}>
                                    <input
                                        type="radio"
                                        name="fotoPortada"
                                        checked={foto !== "" && fotoPortada === foto}
                                        disabled={foto.trim() === ""}
                                        onChange={() => setFotoPortada(foto)} />
                                    Usar como portada
                                </label>

                                <div className={styles.accionesFoto}>
                                    <button
                                        type="button"
                                        onClick={() => moverFoto(indice, -1)}
                                        disabled={indice === 0}>
                                        ↑
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => moverFoto(indice, 1)}
                                        disabled={indice === fotos.length - 1}>
                                        ↓
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFotoAEliminar(indice)}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {foto.trim() && (
                                <img
                                    src={foto}
                                    alt={`Vista previa ${indice + 1}`}
                                    className={styles.previsualizacion} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {errores.fotos && (
                <p className={styles.error}>
                    {errores.fotos}
                </p>
            )}

            {errores.fotoPortada && (
                <p className={styles.error}>
                    {errores.fotoPortada}
                </p>
            )}

            <DialogoConfirmacion
                abierto={fotoAEliminar !== null}
                titulo="Eliminar foto"
                mensaje="¿Seguro que querés eliminar esta foto de la propiedad?"
                textoConfirmar="Eliminar"
                onConfirmar={confirmarEliminarFoto}
                onCancelar={() => setFotoAEliminar(null)}
            />
        </>
    );
}