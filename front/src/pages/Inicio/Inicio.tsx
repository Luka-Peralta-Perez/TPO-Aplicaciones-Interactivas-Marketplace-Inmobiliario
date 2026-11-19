import { useEffect, useState } from "react";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { PropiedadPublica } from "../../types";
import styles from "./Inicio.module.css";
import { EstadoCarga, EstadoVacio, EstadoError } from "../../components/Estados/Estados";
import { TarjetaPropiedad } from "../../components/TarjetaPropiedad/TarjetaPropiedad";
import { FiltrosPropiedades as FormularioFiltrosPropiedades } from "../../components/FiltrosPropiedades/FiltrosPropiedades";
import { useFiltrosPropiedades } from "../../hooks/useFiltrosPropiedades";

export default function Inicio() {
    const [propiedades, setPropiedades] = useState<PropiedadPublica[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const {
        tipo, setTipo,
        operacion, setOperacion,
        precioMin, setPrecioMin,
        precioMax, setPrecioMax,
        zona, setZona,
        ambientes, setAmbientes,
        amenities, setAmenities,
        busqueda, setBusqueda,
        orden, setOrden,
        erroresFiltros,
        aplicarFiltros,
        limpiarFiltros,
        cambiarPagina,
        pagina,
        limite,
        filtrosApi,
    } = useFiltrosPropiedades();

    useEffect(() => {
        async function cargarPropiedades() {
            try {
                setCargando(true);
                setError(null);

                const respuesta = await propiedadesService.listarPublicas(filtrosApi);

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
    }, [filtrosApi]);


    const totalPaginas = Math.ceil(total / limite);

    return (
        <section className={styles.contenedor}>
            <div className={styles.encabezado}>
                <h1>Propiedades</h1>
                <p>
                    Encontrá propiedades disponibles para venta y alquiler.
                </p>
            </div>
            <FormularioFiltrosPropiedades
                tipo={tipo}
                setTipo={setTipo}
                operacion={operacion}
                setOperacion={setOperacion}
                precioMin={precioMin}
                setPrecioMin={setPrecioMin}
                precioMax={precioMax}
                setPrecioMax={setPrecioMax}
                zona={zona}
                setZona={setZona}
                ambientes={ambientes}
                setAmbientes={setAmbientes}
                amenities={amenities}
                setAmenities={setAmenities}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                orden={orden}
                setOrden={setOrden}
                errores={erroresFiltros}
                onSubmit={aplicarFiltros}
                onLimpiar={limpiarFiltros}
            />
            {cargando ? (
                <EstadoCarga mensaje="Cargando propiedades..." />
            ) : error ? (
                <EstadoError mensaje={error} />
            ) : propiedades.length === 0 ? (
                <EstadoVacio mensaje="No se encontraron propiedades con esos filtros." />
            ) : (
                <>
                    <p className={styles.resultados}>
                        {total} propiedad
                        {total !== 1 ? "es" : ""} encontrada
                        {total !== 1 ? "s" : ""}
                    </p>

                    <div className={styles.propiedades}>
                        {propiedades.map((propiedad) => (
                            <TarjetaPropiedad
                                key={propiedad.id}
                                propiedad={propiedad}
                            />
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