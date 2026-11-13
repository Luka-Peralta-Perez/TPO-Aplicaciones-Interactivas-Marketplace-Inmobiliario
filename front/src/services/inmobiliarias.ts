import { apiFetch } from "../comun/api";
import type { ActualizarInmobiliariaInput, InmobiliariaDatos } from "../types";

export const inmobiliariasService = {
    obtenerPropia(): Promise<InmobiliariaDatos> {
        return apiFetch<InmobiliariaDatos>("/agencies/mine");
    },

    actualizar(id: number, datos: ActualizarInmobiliariaInput): Promise<InmobiliariaDatos> {
        return apiFetch<InmobiliariaDatos>(`/agencies/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
        });
    },

    eliminar(id: number): Promise<void> {
        return apiFetch<void>(`/agencies/${id}`, {
            method: "DELETE",
        });
    },
};