import { apiFetch} from "../comun/api";
import type { PropiedadPanel, CrearPropiedadInput, PropiedadDetalle, FiltrosPropiedades, RespuestaPropiedades, ComentarioPropiedad } from "../types";

export const propiedadesService = {
    listarPropias(): Promise<PropiedadPanel[]> {
        return apiFetch<PropiedadPanel[]>("/properties/mine");
    },

    obtener(id: number): Promise<PropiedadDetalle> {
        return apiFetch<PropiedadDetalle>(`/properties/${id}`);
    },

    crear(datos: CrearPropiedadInput): Promise<PropiedadPanel> {
        return apiFetch<PropiedadPanel>("/properties", {
            method: "POST",
            body: JSON.stringify(datos),
        });
    },

    actualizar(id: number, datos: CrearPropiedadInput): Promise<PropiedadDetalle> {
        return apiFetch<PropiedadDetalle>(`/properties/${id}`, {
            method: "PUT",
            body: JSON.stringify(datos),
        });
    },

    listarPublicas(filtros: FiltrosPropiedades = {}): Promise<RespuestaPropiedades> {
        const params = new URLSearchParams();

        if (filtros.page) {
            params.set("page", filtros.page.toString());
        }

        if (filtros.limit) {
            params.set("limit", filtros.limit.toString());
        }

        if (filtros.tipo) {
            params.set("tipo", filtros.tipo);
        }

        if (filtros.operacion) {
            params.set("operacion", filtros.operacion);
        }

        if (filtros.precioMin) {
            params.set("precioMin", filtros.precioMin);
        }

        if (filtros.precioMax) {
            params.set("precioMax", filtros.precioMax);
        }

        if (filtros.zona) {
            params.set("zona", filtros.zona);
        }

        if (filtros.ambientes) {
            params.set("ambientes", filtros.ambientes.toString());
        }

        if (filtros.amenities && filtros.amenities.length > 0) {
            params.set("amenities", filtros.amenities.join(","));
        }

        if (filtros.q) {
            params.set("q", filtros.q);
        }

        if (filtros.sort) {
            params.set("sort", filtros.sort);
        }

        const query = params.toString();

        return apiFetch<RespuestaPropiedades>(
            query ? `/properties?${query}` : "/properties"
        );
    },

    listarComentarios(id: number): Promise<ComentarioPropiedad[]> {
        return apiFetch<ComentarioPropiedad[]>(`/properties/${id}/comments`);
    },

    crearComentario(id: number, datos: {
        nombreAutor: string;
        contenido: string;
    }): Promise<ComentarioPropiedad> {
        return apiFetch<ComentarioPropiedad>(`/properties/${id}/comments`, {
            method: "POST",
            body: JSON.stringify(datos),
        });
    },

    crearSolicitudVisita(id: number, datos: {
        nombreSolicitante: string;
        telefono: string;
        fechaPropuesta: string;
        mensaje?: string;
    }): Promise<void> {
        return apiFetch<void>(`/properties/${id}/visit-requests`, {
            method: "POST",
            body: JSON.stringify(datos),
        });
    },
};