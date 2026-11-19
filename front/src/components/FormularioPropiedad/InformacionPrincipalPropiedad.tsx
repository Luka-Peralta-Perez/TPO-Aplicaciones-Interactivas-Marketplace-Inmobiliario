import type { CrearPropiedadInput } from "../../types";
import type { FormularioPropiedadHook } from "../../hooks/useFormularioPropiedad";
import styles from "./FormularioPropiedad.module.css";

type Props = {
    formulario: FormularioPropiedadHook;
};

export function InformacionPrincipalPropiedad({ formulario }: Props) {
    const {
        titulo, setTitulo,
        descripcion, setDescripcion,
        tipo, setTipo,
        operacion, setOperacion,
        precio, setPrecio,
        moneda, setMoneda,
        errores,
    } = formulario;

    return (
        <div className={styles.seccion}>
            <h2>Información principal</h2>

            <div className={styles.campoCompleto}>
                <label htmlFor="titulo">
                    Título
                </label>
                <input
                    id="titulo"
                    type="text"
                    value={titulo}
                    onChange={(event) => setTitulo(event.target.value)}
                    maxLength={160}
                    required />
                {errores.titulo && (
                    <p className={styles.error}>
                        {errores.titulo}
                    </p>
                )}
            </div>

            <div className={styles.campoCompleto}>
                <label htmlFor="descripcion">
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(event) => setDescripcion(event.target.value)}
                    rows={5}
                    required />
                {errores.descripcion && (
                    <p className={styles.error}>
                        {errores.descripcion}
                    </p>
                )}
            </div>

            <div className={styles.grilla}>
                <div className={styles.campo}>
                    <label htmlFor="tipo">
                        Tipo
                    </label>
                    <select
                        id="tipo"
                        value={tipo}
                        onChange={(event) => setTipo(event.target.value as CrearPropiedadInput["tipo"])}>
                        <option value="CASA">
                            Casa
                        </option>
                        <option value="DEPARTAMENTO">
                            Departamento
                        </option>
                        <option value="TERRENO">
                            Terreno

                        </option>
                        <option value="LOCAL">
                            Local

                        </option>
                    </select>
                </div>

                <div className={styles.campo}>
                    <label htmlFor="operacion">
                        Operación
                    </label>
                    <select id="operacion" value={operacion}
                        onChange={(event) => setOperacion(event.target.value as CrearPropiedadInput["operacion"])}>
                        <option value="VENTA">Venta</option>
                        <option value="ALQUILER">Alquiler</option>
                    </select>
                </div>

                <div className={styles.campo}>
                    <label htmlFor="precio">
                        Precio
                    </label>
                    <input
                        id="precio"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={precio}
                        onChange={(event) => setPrecio(event.target.value)}
                        required />
                    {errores.precio && (
                        <p className={styles.error}>
                            {errores.precio}
                        </p>
                    )}
                </div>

                <div className={styles.campo}>
                    <label htmlFor="moneda">Moneda</label>
                    <select id="moneda" value={moneda}
                        onChange={(event) => setMoneda(event.target.value as CrearPropiedadInput["moneda"])}>
                        <option value="USD">USD</option>
                        <option value="ARS">ARS</option>
                    </select>
                </div>
            </div>
        </div>
    );
}