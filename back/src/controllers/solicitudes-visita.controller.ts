import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CrearSolicitudVisitaDto, CambiarEstadoSolicitudVisitaDto } from "./solicitudes-visita.dto";
import { solicitudesVisitaService } from "../services/solicitudes-visita.service";
import { obtenerDetallesValidacion } from "../utils/validation";

export class SolicitudesVisitaController {
    async crear(req: Request, res: Response) {
        const propiedadId = Number(req.params.id);

        if (!Number.isInteger(propiedadId) || propiedadId <= 0) {
            res.status(404).json({
                error: "Propiedad no encontrada",
            });
            return;
        }

        const dto = plainToInstance(CrearSolicitudVisitaDto, req.body);

        const errores = await validate(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errores.length > 0) {
            res.status(400).json({
                error: "Datos inválidos",
                details: obtenerDetallesValidacion(errores),
            });
            return;
        } 

        const solicitud = await solicitudesVisitaService.crear(propiedadId, dto);

        res.status(201).json(solicitud);
    }

    async cambiarEstado(req: Request, res: Response) {
        const id = Number(req.params.id)

        if (!Number.isInteger(id) || id <= 0) {
            res.status(404).json({
                error: "solicitud de visita no encontrada",
            });
            return;
        }

        const dto = plainToInstance(CambiarEstadoSolicitudVisitaDto, req.body);

        const errores = await validate(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errores.length > 0) {
            res.status(400).json({
                error: "Datos inválidos",
                details: obtenerDetallesValidacion(errores),
            });
            return;
        }

        const solicitud = await solicitudesVisitaService.cambiarEstado(id, dto, req.vendedorId!);
        res.status(200).json(solicitud);
    }

    async listarPorInmobiliaria(req: Request, res: Response) {
        const inmobiliariaId = Number(req.params.id);

        if (!Number.isInteger(inmobiliariaId) || inmobiliariaId <= 0) {
            res.status(404).json({
                error: "Inmobiliaria no encontrada",
            });
            return;
        }

        const solicitudes = await solicitudesVisitaService.listarPorInmobiliaria(inmobiliariaId, req.vendedorId!);
        res.status(200).json(solicitudes);
    }
}

export const solicitudesVisitaController = new SolicitudesVisitaController();
