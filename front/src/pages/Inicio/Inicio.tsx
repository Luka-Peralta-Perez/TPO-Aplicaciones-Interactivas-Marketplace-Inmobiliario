import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { FiltrosPropiedades, PropiedadPublica } from "../../types";
import styles from "./Inicio.module.css";
import { EstadoCarga, EstadoVacio, EstadoError } from "../../components/Estados/Estados";

type ErroresFiltros = {
    precioMin?: string;
    precioMax?: string;
    ambientes?: string;
};

export default function Inicio() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [propiedades, setPropiedades] = useState<PropiedadPublica[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pagina = Math.max(1, Number(searchParams.get("page")) || 1);
    const [total, setTotal] = useState(0);
    const limite = 6;
    const [tipo, setTipo] = useState(searchParams.get("tipo") ?? "");
    const [operacion, setOperacion] = useState(searchParams.get("operacion") ?? "");
    const [precioMin, setPrecioMin] = useState(searchParams.get("precioMin") ?? "");
    const [precioMax, setPrecioMax] = useState(searchParams.get("precioMax") ?? "");
    const [zona, setZona] = useState(searchParams.get("zona") ?? "");
    const [ambientes, setAmbientes] = useState(searchParams.get("ambientes") ?? "");
    const [amenities, setAmenities] = useState(searchParams.get("amenities") ?? "");
    const [busqueda, setBusqueda] = useState(searchParams.get("q") ?? "");
    const [orden, setOrden] = useState(searchParams.get("sort") ?? "");
    const [erroresFiltros, setErroresFiltros] = useState<ErroresFiltros>({});

    // Mantiene los campos sincronizados con la URL
    useEffect(() => {
        setTipo(searchParams.get("tipo") ?? "");
        setOperacion(searchParams.get("operacion") ?? "");
        setPrecioMin(searchParams.get("precioMin") ?? "");
        setPrecioMax(searchParams.get("precioMax") ?? "");
        setZona(searchParams.get("zona") ?? "");
        setAmbientes(searchParams.get("ambientes") ?? "");
        setAmenities(searchParams.get("amenities") ?? "");
        setBusqueda(searchParams.get("q") ?? "");
        setOrden(searchParams.get("sort") ?? "");
    }, [searchParams]);
    
    useEffect(() => {
        async function cargarPropiedades() {
            try {
                setCargando(true);
                setError(null);

                const filtros: FiltrosPropiedades = {
                    page: pagina,
                    limit: limite,

                    tipo: (searchParams.get("tipo") as FiltrosPropiedades["tipo"]) ||
                    undefined,

                    operacion: (searchParams.get("operacion") as FiltrosPropiedades["operacion"]) ||
                    undefined,

                    precioMin: searchParams.get("precioMin") ||
                    undefined,

                    precioMax: searchParams.get("precioMax") ||
                    undefined,

                    zona: searchParams.get("zona") ||
                    undefined,

                    ambientes: searchParams.get("ambientes") ? Number(searchParams.get("ambientes"))
                    : undefined,

                    amenities: searchParams.get("amenities") ? searchParams
                    .get("amenities")!
                    .split(",")
                    .map((amenity) => amenity.trim())
                    .filter((amenity) => amenity !== "")
                    : undefined,

                    q: searchParams.get("q") ||
                    undefined,

                    sort: (searchParams.get("sort") as FiltrosPropiedades["sort"]) ||
                    undefined,
                };

                const respuesta = await propiedadesService.listarPublicas(filtros);

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
    }, [searchParams, pagina]);

    function aplicarFiltros(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErroresFiltros({});

        const nuevosErrores: ErroresFiltros = {};

        if(precioMin.trim() && Number(precioMin) < 0) {
            nuevosErrores.precioMin = "El precio mínimo no puede ser negativo.";
        }

        if(precioMax.trim() && Number(precioMax) < 0) {
            nuevosErrores.precioMax = "El precio máximo no puede ser negativo.";
        }

        if(precioMin.trim() && precioMax.trim() 
            && Number(precioMin) > Number(precioMax)) {
            nuevosErrores.precioMax = "El precio máximo debe ser mayor o igual al mínimo.";
        }

        if(ambientes && Number(ambientes) < 1) {
            nuevosErrores.ambientes = "La cantidad de ambientes debe ser al menos 1.";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresFiltros(nuevosErrores);
            return;
        }

        const params = new URLSearchParams();

        if (tipo) {
            params.set("tipo", tipo);
        }

        if (operacion) {
            params.set("operacion", operacion);
        }

        if (precioMin.trim()) {
            params.set("precioMin", precioMin.trim());
        }

        if (precioMax.trim()) {
            params.set("precioMax", precioMax.trim());
        }

        if (zona.trim()) {
            params.set("zona", zona.trim());
        }

        if (ambientes) {
            params.set("ambientes", ambientes);
        }

        if (amenities.trim()) {
            params.set("amenities", amenities.trim());
        }

        if (busqueda.trim()) {
            params.set("q", busqueda.trim());
        }

        if (orden) {
            params.set("sort", orden);
        }

        params.set("page", "1");

        setSearchParams(params);
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
        setSearchParams({});
        setErroresFiltros({});
    }

    function cambiarPagina(nuevaPagina: number) {
        const params = new URLSearchParams(searchParams);

        params.set("page", nuevaPagina.toString());
        setSearchParams(params);
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
                onSubmit={aplicarFiltros}
                noValidate>
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

                            {erroresFiltros.precioMin && (
                                <p className={styles.error}>
                                    {erroresFiltros.precioMin}
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

                            {erroresFiltros.precioMax && (
                                <p className={styles.error}>
                                    {erroresFiltros.precioMax}
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

                            {erroresFiltros.ambientes && (
                                <p className={styles.error}>
                                    {erroresFiltros.ambientes}
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
                        onClick={limpiarFiltros}>
                        Limpiar filtros
                    </button>
                </div>
            </form>
            {cargando ? (
                <EstadoCarga mensaje="Cargando propiedades..."/>
            ) : error ? (
                <EstadoError mensaje={error}/>
            ) : propiedades.length === 0 ? (
                <EstadoVacio mensaje="No se encontraron propiedades con esos filtros."/>
            ) : (
                <>
                    <p className={styles.resultados}>
                        {total} propiedad
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
                                onClick={() => cambiarPagina(pagina - 1)}>
                                Anterior
                            </button>

                            <span>
                                Página {pagina} de{" "}
                                {totalPaginas}
                            </span>

                            <button
                                type="button"
                                disabled={pagina === totalPaginas}
                                onClick={() => cambiarPagina(pagina + 1)}>
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