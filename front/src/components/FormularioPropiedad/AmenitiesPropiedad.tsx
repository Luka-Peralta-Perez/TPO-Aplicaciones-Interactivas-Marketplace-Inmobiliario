import { AMENITIES, type FormularioPropiedadHook } from "../../hooks/useFormularioPropiedad";
import styles from "./FormularioPropiedad.module.css";

type Props = {
    formulario: FormularioPropiedadHook;
};

export function AmenitiesPropiedad({ formulario }: Props) {
    const {
        amenities,
        cambiarAmenity,
    } = formulario;

    return (
        <div className={styles.seccion}>
            <h2>Amenities</h2>

            <div className={styles.amenities}>
                {AMENITIES.map((amenity) => (
                    <label
                        key={amenity}
                        className={styles.checkbox}>
                        <input
                            type="checkbox"
                            checked={amenities.includes(amenity)}
                            onChange={() => cambiarAmenity(amenity)} />
                        {amenity}
                    </label>
                ))}
            </div>
        </div>
    );
}