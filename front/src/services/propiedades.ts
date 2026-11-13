import { API_URL, apiFetch } from "../comun/api";
import type { PropiedadPanel, CrearPropiedadInput, PropiedadDetalle } from "../types";

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
};