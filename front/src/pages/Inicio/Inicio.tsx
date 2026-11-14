import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { FiltrosPropiedades, PropiedadPublica } from "../../types";
import styles from "./Inicio.module.css";

export default function Inicio() {
    const [propiedades, setPropiedades] = useState<PropiedadPublica[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagina, setPagina] = useState(1);
    const [total, setTotal] = useState(0);
    const limite = 6;
    const [tipo, setTipo] = useState("");
    const [operacion, setOperacion] = useState("");
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");
    const [zona, setZona] = useState("");
    const [ambientes, setAmbientes] = useState("");
    const [amenities, setAmenities] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [orden, setOrden] = useState("");
    const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosPropiedades>({});

    useEffect(() => {
        async function cargarPropiedades() {
            try {
                setCargando(true);
                setError(null);

                const respuesta = await propiedadesService.listarPublicas({
                    ...filtrosAplicados,
                    page: pagina,
                    limit: limite,
                });

                setPropiedades(respuesta.items);
                setTotal(respuesta.total);
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudieron cargar las propiedades.");
                }
            } finally {
                setCargando(false);
            }
        }
        cargarPropiedades();
    }, [filtrosAplicados, pagina]);

    function aplicarFiltros(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPagina(1);

        setFiltrosAplicados({
            tipo:
                tipo === ""
                    ? undefined
                    : (tipo as FiltrosPropiedades["tipo"]),

            operacion:
                operacion === ""
                    ? undefined
                    : (operacion as FiltrosPropiedades["operacion"]),

            precioMin:
                precioMin.trim() || undefined,

            precioMax:
                precioMax.trim() || undefined,

            zona:
                zona.trim() || undefined,

            ambientes:
                ambientes
                    ? Number(ambientes)
                    : undefined,

            amenities: amenities.trim()
                ? amenities
                    .split(",")
                    .map((amenity) => amenity.trim())
                    .filter((amenity) => amenity !== "")
                : undefined,

            q:
                busqueda.trim() || undefined,

            sort:
                orden === ""
                    ? undefined
                    : (orden as FiltrosPropiedades["sort"]),
        });
    }

    function limpiarFiltros() {
        setTipo("");
        setOperacion("");
        setPrecioMin("");
        setPrecioMax("");
        setZona("");
        setAmbientes("");
        setAmenities("");
        setBusqueda("");
        setOrden("");
        setPagina(1);
        setFiltrosAplicados({});
    }

    const totalPaginas = Math.ceil(total / limite);

    return (
        <section className={styles.contenedor}>
            <div className={styles.encabezado}>
                <h1>Propiedades</h1>
                <p>
                    Encontrá propiedades disponibles para venta y alquiler.
                </p>
            </div>
            <form
                className={styles.filtros}
                onSubmit={aplicarFiltros}>
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
                    </div>

                    <div className={styles.campo}>
                        <label htmlFor="precioMaz">
                            Precio máximo
                        </label>
                        <input
                            id="precioMax"
                            type="number"
                            min="0"
                            value={precioMax}
                            onChange={(event) => setPrecioMax(event.target.value)} />
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
                        onClick={limpiarFiltros}>
                        Limpiar filtros
                    </button>
                </div>
            </form>

            {error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}

            {cargando ? (
                <p>Cargando propiedades...</p>
            ) : propiedades.length === 0 ? (
                <p>
                    No se encontraron propiedades con esos filtros.
                </p>
            ) : (
                <>
                    <p className={styles.resultados}>
                        {total} propiedade
                        {total !== 1 ? "es" : ""} encontrada
                        {total !== 1 ? "s" : ""}
                    </p>

                    <div className={styles.propiedades}>
                        {propiedades.map((propiedad) => (
                            <article
                                key={propiedad.id}
                                className={styles.tarjeta}>
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
                                        {Number(propiedad.precio).toLocaleString("es-AR")}
                                    </p>

                                    <p>{propiedad.tipo}
                                        {" · "}
                                        {propiedad.superficieTotalM2}
                                        m²
                                        {propiedad.ambientes
                                            ? ` · ${propiedad.ambientes} ambientes`
                                            : ""}
                                    </p>

                                    <Link to={`/propiedades/${propiedad.id}`}>
                                        Ver propiedad
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                    {totalPaginas > 1 && (
                        <div
                            className={styles.paginacion}>
                            <button
                                type="button"
                                disabled={pagina === 1}
                                onClick={() => setPagina(pagina - 1)}>
                                Anterior
                            </button>

                            <span>
                                Página {pagina} de{" "}
                                {totalPaginas}
                            </span>

                            <button
                                type="button"
                                disabled={pagina === totalPaginas}
                                onClick={() => setPagina(pagina + 1)}>
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )
            }
        </section>
    );
}