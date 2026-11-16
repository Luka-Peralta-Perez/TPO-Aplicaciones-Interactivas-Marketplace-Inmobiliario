import { apiFetch } from "../comun/api";
import type { ReportePropiedadesPorEstado, ReporteMensual, ReporteTiempoMercado } from "../types";

export const reportesService = {
    obtenerEstados(inmobiliariaId: number): Promise<ReportePropiedadesPorEstado> {
        return apiFetch<ReportePropiedadesPorEstado>(`/agencies/${inmobiliariaId}/reports/status-summary`);
    },

    obtenerMensual(inmobiliariaId: number): Promise<ReporteMensual[]> {
        return apiFetch<ReporteMensual[]>(`/agencies/${inmobiliariaId}/reports/monthly`);
    },

    obtenerTiempoPromedio(inmobiliariaId: number): Promise<ReporteTiempoMercado> {
        return apiFetch<ReporteTiempoMercado>(`/agencies/${inmobiliariaId}/reports/avg-time-on-market`);
    },
};