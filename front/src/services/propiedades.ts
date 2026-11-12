import { API_URL, apiFetch } from "../comun/api";
import type { PropiedadPanel, CrearPropiedadInput } from "../types";

export const propiedadesService = {
    listarPropias(): Promise<PropiedadPanel[]> {
        return apiFetch<PropiedadPanel[]>("/properties/mine");
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
};