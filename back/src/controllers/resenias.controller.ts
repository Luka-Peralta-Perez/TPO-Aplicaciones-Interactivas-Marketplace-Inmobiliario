import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CrearReseniaDto } from "./resenias.dto";
import { reseniasService } from "../services/resenias.service";
import { obtenerDetallesValidacion } from "../utils/validation";

export class ReseniasController {
    async crear(req: Request, res: Response) {
        const inmobiliariaId = Number(req.params.id);

       if (!Number.isInteger(inmobiliariaId) || inmobiliariaId <= 0) {
            res.status(404).json({
                error: "Inmobiliaria no encontrada",
            });
            return;
        } 

        const dto = plainToInstance(CrearReseniaDto, req.body);

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

        const resenia = await reseniasService.crear(inmobiliariaId, dto);
        res.status(201).json(resenia);
    }

    async listar(req: Request, res: Response) {
        const inmobiliariaId = Number(req.params.id);

        if (!Number.isInteger(inmobiliariaId) || inmobiliariaId <= 0) {
            res.status(404).json({
                error: "Inmobiliaria no encontrada",
            });
            return;
        } 

        const resenias = await reseniasService.listarPorInmobiliaria(inmobiliariaId);
        res.status(200).json(resenias);

    }
}

export const reseniasController = new ReseniasController();