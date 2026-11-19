import { Link } from "react-router-dom";
import type { PropiedadPublica } from "../../types";
import styles from "./TarjetaPropiedadInmobiliaria.module.css";

type Props = {
    propiedad: PropiedadPublica;
};

export function TarjetaPropiedadInmobiliaria({ propiedad }: Props) {
    return (
        <article className={styles.tarjeta}>
            <img
                src={propiedad.fotoPortada}
                alt={propiedad.titulo} />

            <div className={styles.contenidoTarjeta}>
                <span>{propiedad.operacion}</span>
                <h3>{propiedad.titulo}</h3>
                <p>{propiedad.zona}</p>

                <strong>
                    {propiedad.moneda}{" "}
                    {Number(propiedad.precio).toLocaleString("es-AR")}
                </strong>

                <Link
                    to={`/propiedades/${propiedad.id}`}
                    className={styles.verPropiedad}>
                    Ver propiedad
                </Link>
            </div>
        </article>
    );
}