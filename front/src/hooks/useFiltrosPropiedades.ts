import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import type { FiltrosPropiedades } from "../types";

type ErroresFiltros = {
    precioMin?: string;
    precioMax?: string;
    ambientes?: string;
};

const LIMITE = 6;

export function useFiltrosPropiedades() {
    const [searchParams, setSearchParams] = useSearchParams();
    const pagina = Math.max(1, Number(searchParams.get("page")) || 1);
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

    const filtrosApi = useMemo<FiltrosPropiedades>(() => ({
        page: pagina,

        limit: LIMITE,

        tipo: (searchParams.get("tipo") as FiltrosPropiedades["tipo"]) || undefined,

        operacion: (searchParams.get("operacion") as FiltrosPropiedades["operacion"]) || undefined,

        precioMin: searchParams.get("precioMin") || undefined,

        precioMax: searchParams.get("precioMax") || undefined,

        zona: searchParams.get("zona") || undefined,

        ambientes: searchParams.get("ambientes") ?
            Number(searchParams.get("ambientes")) : undefined,

        amenities: searchParams.get("amenities")
            ? searchParams.get("amenities")!.split(",").map((amenity) =>
                amenity.trim()).filter((amenity) => amenity !== "")
            : undefined,

        q: searchParams.get("q") || undefined,

        sort: (searchParams.get("sort") as FiltrosPropiedades["sort"]) || undefined,
        
    }), [searchParams, pagina]);

    function aplicarFiltros(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErroresFiltros({});

        const nuevosErrores: ErroresFiltros = {};

        if (precioMin.trim() && Number(precioMin) < 0) {
            nuevosErrores.precioMin = "El precio mínimo no puede ser negativo.";
        }

        if (precioMax.trim() && Number(precioMax) < 0) {
            nuevosErrores.precioMax = "El precio máximo no puede ser negativo.";
        }

        if (precioMin.trim() && precioMax.trim() && Number(precioMin) > Number(precioMax)) {
            nuevosErrores.precioMax = "El precio máximo debe ser mayor o igual al mínimo.";
        }

        if (ambientes && Number(ambientes) < 1) {
            nuevosErrores.ambientes = "La cantidad de ambientes debe ser al menos 1.";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresFiltros(nuevosErrores);
            return;
        }

        const params = new URLSearchParams();

        if (tipo)
            params.set("tipo", tipo);
        if (operacion)
            params.set("operacion", operacion);
        if (precioMin.trim())
            params.set("precioMin", precioMin.trim());
        if (precioMax.trim())
            params.set("precioMax", precioMax.trim());
        if (zona.trim())
            params.set("zona", zona.trim());
        if (ambientes)
            params.set("ambientes", ambientes);
        if (amenities.trim())
            params.set("amenities", amenities.trim());
        if (busqueda.trim())
            params.set("q", busqueda.trim());
        if (orden)
            params.set("sort", orden);

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
        setErroresFiltros({});
        setSearchParams({});
    }

    function cambiarPagina(nuevaPagina: number) {
        const params = new URLSearchParams(searchParams);
        params.set("page", nuevaPagina.toString());
        setSearchParams(params);
    }

    return {
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
        limite: LIMITE,
        filtrosApi,
    };
}