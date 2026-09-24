import { Request, Response } from "express";
import { actividadesService } from "../services/actividades.service";

export class ActividadesController {
    async listar(req: Request, res: Response) {
        const inmobiliariaId = Number(req.params.id);

        if (!Number.isInteger(inmobiliariaId) || inmobiliariaId <= 0) {
            res.status(404).json({
                error: "Inmobiliaria no encontrada",
            });
            return;
        } 

        const actividades = await actividadesService.listar(inmobiliariaId, req.vendedorId!);
        res.status(200).json(actividades);
    }

    async contarNoLeidas(req: Request, res: Response) {
        const inmobiliariaId = Number(req.params.id);

        if (!Number.isInteger(inmobiliariaId) || inmobiliariaId <= 0) {
            res.status(404).json({
                error: "Inmobiliaria no encontrada",
            });
            return;
        }

        const cantidad = await actividadesService.contarNoLeidas(inmobiliariaId, req.vendedorId!);
        res.status(200).json({
            unreadCount: cantidad,
        });
    }

    async marcarComoLeida(req: Request, res: Response) {
        const actividadId = Number(req.params.id);
        
        if (!Number.isInteger(actividadId) || actividadId <= 0) {
            res.status(404).json({
                error: "Actividad no encontrada",
            });
            return;
        }

        const actividad = await actividadesService.marcarComoLeida(actividadId, req.vendedorId!);
        res.status(200).json(actividad);
    }
}

export const actividadesController = new ActividadesController();