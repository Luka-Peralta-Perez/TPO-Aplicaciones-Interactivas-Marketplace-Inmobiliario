import styles from "./Estados.module.css";

type EstadoProps = {
    mensaje: string;
};

export function EstadoCarga({ mensaje }: EstadoProps) {
    return (
        <div className={styles.estado}>
            <p className={styles.carga}>
                {mensaje}
            </p>
        </div>
    );
}

export function EstadoVacio({ mensaje }: EstadoProps) {
    return (
        <div className={styles.estado}>
            <p className={styles.vacio}>
                {mensaje}
            </p>
        </div>
    );
}

export function EstadoError({ mensaje }: EstadoProps) {
    return (
        <div className={styles.estado}>
            <p className={styles.error}>
                {mensaje}
            </p>
        </div>
    );
}