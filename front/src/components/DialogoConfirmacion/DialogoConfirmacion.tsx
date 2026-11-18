import styles from "./DialogoConfirmacion.module.css";

type DialogoConfirmacionProps = {
    abierto: boolean;
    titulo: string;
    mensaje: string;
    textoConfirmar?: string;
    textoCancelar?: string;
    cargando?: boolean;
    onConfirmar: () => void;
    onCancelar: () => void;
};

export function DialogoConfirmacion({
    abierto,
    titulo,
    mensaje,
    textoConfirmar = "Confirmar",
    textoCancelar = "Cancelar",
    cargando = false,
    onConfirmar,
    onCancelar,
}: DialogoConfirmacionProps) {
    if (!abierto) {
        return null;
    }

    return (
        <div className={styles.fondo}>
            <div
                className={styles.dialogo}
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-dialogo">
                <h2 id="titulo-dialogo">{titulo}</h2>
                <p>{mensaje}</p>

                <div className={styles.acciones}>
                    <button
                        type="button"
                        className={styles.cancelar}
                        onClick={onCancelar}
                        disabled={cargando}>
                        {textoCancelar}
                    </button>

                    <button
                        type="button"
                        className={styles.confirmar}
                        onClick={onConfirmar}
                        disabled={cargando}>
                        {cargando ? "Procesando..." : textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
}
