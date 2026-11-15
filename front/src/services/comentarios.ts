import { apiFetch } from "../comun/api";
import type { ComentarioPropiedad } from "../types";

export const comentariosService = {
    responder(comentarioId: number, respuesta: string): Promise<ComentarioPropiedad> {
        return apiFetch<ComentarioPropiedad>(`/comments/${comentarioId}/reply`, {
            method: "PATCH",
            body: JSON.stringify({respuesta}),
        });
    },
};