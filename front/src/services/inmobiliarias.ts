import { apiFetch } from "../comun/api";
import type { ActualizarInmobiliariaInput, InmobiliariaDatos, PropiedadPublica, ReseniaPublica, RespuestaPropiedades } from "../types";

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

    obtenerPublica(id: number): Promise<InmobiliariaDatos> {
        return apiFetch<InmobiliariaDatos>(`/agencies/${id}`);
    },

    listarPropiedadesPublicas(id: number): Promise<PropiedadPublica[] | RespuestaPropiedades> {
        return apiFetch<PropiedadPublica[] | RespuestaPropiedades>(`/agencies/${id}/properties`);
    },

    listarResenias(id: number): Promise<ReseniaPublica[]> {
        return apiFetch<ReseniaPublica[]>(`/agencies/${id}/reviews`);
    },

    crearResenia(id: number, datos: {
        nombreAutor: string;
        contenido: string;
        calificacion: number;
    }): Promise<ReseniaPublica> {
        return apiFetch<ReseniaPublica>(`/agencies/${id}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
        });
    },

};