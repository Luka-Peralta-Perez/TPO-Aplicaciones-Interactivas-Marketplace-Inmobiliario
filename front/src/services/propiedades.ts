import { API_URL, apiFetch } from "../comun/api";
import type { PropiedadPanel, CrearPropiedadInput, PropiedadDetalle, FiltrosPropiedades, RespuestaPropiedades } from "../types";

export const propiedadesService = {
    listarPropias(): Promise<PropiedadPanel[]> {
        return apiFetch<PropiedadPanel[]>("/properties/mine");
    },

    obtener(id: number): Promise<PropiedadDetalle> {
        return apiFetch<PropiedadDetalle>(`/properties/${id}`);
    },

    crear (datos: CrearPropiedadInput): Promise<PropiedadPanel> {
        return apiFetch<PropiedadPanel>("/properties", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
        });
    },

    actualizar(id: number, datos: CrearPropiedadInput): Promise<PropiedadDetalle> {
        return apiFetch<PropiedadDetalle>(`/properties/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
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
};