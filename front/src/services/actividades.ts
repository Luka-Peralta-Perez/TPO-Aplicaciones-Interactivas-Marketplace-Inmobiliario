import { apiFetch } from "../comun/api";
import type { Actividad } from "../types";

export const actividadesService = {
    listar(inmobiliariaId: number): Promise<Actividad[]> {
        return apiFetch<Actividad[]>(`/agencies/${inmobiliariaId}/activity`);
    },

    contarNoLeidas(inmobiliariaId: number): Promise<{unreadCount: number}> {
        return apiFetch<{unreadCount: number}>(`/agencies/${inmobiliariaId}/activity/unread-count`);
    },

    marcarComoLeida(actividadId: number): Promise<Actividad> {
        return apiFetch<Actividad>(`/activity/${actividadId}/read`, {
            method: "PATCH",
        });
    },
};