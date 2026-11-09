import {Request, Response} from "express";
import { reportesService } from "../services/reportes.service";

export class ReportesController {
    async resumenPorEstado(req: Request, res: Response) {
        const inmobiliariaId = Number(req.params.id);

        if(!Number.isInteger(inmobiliariaId) || inmobiliariaId <= 0) {
            res.status(404).json({
                error: "Inmobiliaria no encontrada",
            });
            return;
        }
        const reporte = await reportesService.resumenPorEstado(inmobiliariaId, req.vendedorId!);
        res.status(200).json(reporte);
    }

    async resumenMensual(req: Request, res: Response) {
        const inmobiliariaId = Number(req.params.id);

        if (!Number.isInteger(inmobiliariaId) || inmobiliariaId <= 0) {
            res.status(404).json({
                error: "Inmobiliaria no encontrada",
            });
            return;
        }

        const reporte = await reportesService.resumenMensual(inmobiliariaId, req.vendedorId!);
        res.status(200).json(reporte);
    }

    async promedioTiempoEnMercado(req: Request, res: Response) {
        const inmobiliariaId = Number(req.params.id);

        if(!Number.isInteger(inmobiliariaId) || inmobiliariaId <= 0) {
            res.status(404).json({
                error: "Inmobiliaria no encontrada",
            });
            return;
        }

        const reporte = await reportesService.promedioTiempoEnMercado(inmobiliariaId, req.vendedorId!);
        res.status(200).json(reporte);
    }
}

export const reportesController = new ReportesController();