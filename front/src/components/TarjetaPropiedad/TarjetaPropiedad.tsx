import { Link } from "react-router-dom";
import type { PropiedadPublica } from "../../types";
import styles from "./TarjetaPropiedad.module.css";

type Props = {
    propiedad: PropiedadPublica;
};

export function TarjetaPropiedad({ propiedad }: Props) {
    return (
        <article className={styles.tarjeta}>
            <img
                src={propiedad.fotoPortada}
                alt={propiedad.titulo}
                className={styles.imagen} />

            <div className={styles.contenido}>
                <span className={styles.operacion}>
                    {propiedad.operacion}
                </span>

                <h2>{propiedad.titulo}</h2>

                <p>{propiedad.zona}</p>

                <p className={styles.precio}>
                    {propiedad.moneda}{" "}
                    {Number(
                        propiedad.precio
                    ).toLocaleString("es-AR")}
                </p>

                <p>
                    {propiedad.tipo}
                    {" · "}
                    {propiedad.superficieTotalM2} m²
                    {propiedad.ambientes
                        ? ` · ${propiedad.ambientes} ambientes`
                        : ""}
                </p>

                <Link
                    to={`/propiedades/${propiedad.id}`}
                    className={styles.verPropiedad}>
                    Ver propiedad
                </Link>
            </div>
        </article>
    );
}