import type { FormEventHandler } from "react";
import styles from "./FiltrosPropiedades.module.css";

type ErroresFiltros = {
    precioMin?: string;
    precioMax?: string;
    ambientes?: string;
};

type Props = {
    tipo: string;
    setTipo: (valor: string) => void;

    operacion: string;
    setOperacion: (valor: string) => void;

    precioMin: string;
    setPrecioMin: (valor: string) => void;

    precioMax: string;
    setPrecioMax: (valor: string) => void;

    zona: string;
    setZona: (valor: string) => void;

    ambientes: string;
    setAmbientes: (valor: string) => void;

    amenities: string;
    setAmenities: (valor: string) => void;

    busqueda: string;
    setBusqueda: (valor: string) => void;

    orden: string;
    setOrden: (valor: string) => void;

    errores: ErroresFiltros;

    onSubmit: FormEventHandler<HTMLFormElement>;
    onLimpiar: () => void;
};

export function FiltrosPropiedades({
    tipo,
    setTipo,
    operacion,
    setOperacion,
    precioMin,
    setPrecioMin,
    precioMax,
    setPrecioMax,
    zona,
    setZona,
    ambientes,
    setAmbientes,
    amenities,
    setAmenities,
    busqueda,
    setBusqueda,
    orden,
    setOrden,
    errores,
    onSubmit,
    onLimpiar,
}: Props) {
    return (
        <form
            className={styles.filtros}
            onSubmit={onSubmit}
            noValidate
        >
            <div className={styles.campoBusqueda}>
                <label htmlFor="busqueda">
                    Buscar
                </label>

                <input
                    id="busqueda"
                    type="text"
                    placeholder="Título o descripción"
                    value={busqueda}
                    onChange={(event) => setBusqueda(event.target.value)} />
            </div>

            <div className={styles.grillaFiltros}>
                <div className={styles.campo}>
                    <label htmlFor="tipo">
                        Tipo
                    </label>

                    <select
                        id="tipo"
                        value={tipo}
                        onChange={(event) => setTipo(event.target.value)}>
                        <option value="">
                            Todos
                        </option>

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

                    <select
                        id="operacion"
                        value={operacion}
                        onChange={(event) => setOperacion(event.target.value)}>
                        <option value="">
                            Todas
                        </option>

                        <option value="VENTA">
                            Venta
                        </option>

                        <option value="ALQUILER">
                            Alquiler
                        </option>
                    </select>
                </div>

                <div className={styles.campo}>
                    <label htmlFor="precioMin">
                        Precio mínimo
                    </label>

                    <input
                        id="precioMin"
                        type="number"
                        min="0"
                        value={precioMin}
                        onChange={(event) => setPrecioMin(event.target.value)} />

                    {errores.precioMin && (
                        <p className={styles.error}>
                            {errores.precioMin}
                        </p>
                    )}
                </div>

                <div className={styles.campo}>
                    <label htmlFor="precioMax">
                        Precio máximo
                    </label>

                    <input
                        id="precioMax"
                        type="number"
                        min="0"
                        value={precioMax}
                        onChange={(event) => setPrecioMax(event.target.value)} />

                    {errores.precioMax && (
                        <p className={styles.error}>
                            {errores.precioMax}
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
                        onChange={(event) => setZona(event.target.value)} />
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
                    <label htmlFor="amenities">
                        Amenities
                    </label>

                    <input
                        id="amenities"
                        type="text"
                        placeholder="pileta, cochera"
                        value={amenities}
                        onChange={(event) => setAmenities(event.target.value)} />
                </div>

                <div className={styles.campo}>
                    <label htmlFor="orden">
                        Ordenar por
                    </label>

                    <select
                        id="orden"
                        value={orden}
                        onChange={(event) => setOrden(event.target.value)}>
                        <option value="">
                            Más recientes
                        </option>

                        <option value="precio">
                            Precio
                        </option>

                        <option value="fechaPublicacion">
                            Fecha de publicación
                        </option>

                        <option value="superficieTotal">
                            Superficie
                        </option>
                    </select>
                </div>
            </div>

            <div className={styles.accionesFiltros}>
                <button type="submit">
                    Buscar
                </button>

                <button
                    type="button"
                    onClick={onLimpiar}
                >
                    Limpiar filtros
                </button>
            </div>
        </form>
    );
}