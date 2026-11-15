import { apiFetch } from "../comun/api";
import type { SolicitudVisita, EstadoSolicitudVisita } from "../types";

export const visitasService = {
    listar(inmobiliariaId: number): Promise<SolicitudVisita[]> {
        return apiFetch<SolicitudVisita[]>(`/agencies/${inmobiliariaId}/visit-requests`);
    },

    cambiarEstado(solicitudId: number, estado: EstadoSolicitudVisita): Promise<SolicitudVisita>{
        return apiFetch<SolicitudVisita>(`/visit-requests/${solicitudId}/status`, 
            {
                method: "PATCH",
                body: JSON.stringify({
                    estado,
                }),
            }
        );
    },
};