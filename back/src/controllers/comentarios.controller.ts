import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CrearComentarioDto, ResponderComentarioDto } from "./comentarios.dto";
import { comentariosService } from "../services/comentarios.service";
import { obtenerDetallesValidacion } from "../utils/validation";

export class ComentariosController {
    async crear(req: Request, res: Response) {
        const propiedadId = Number(req.params.id);

        if (!Number.isInteger(propiedadId) || propiedadId <= 0) {
            res.status(404).json({
                error: "Propiedad no encontrada",
            });
            return;
        }

        const dto = plainToInstance(CrearComentarioDto, req.body);

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

        const comentario = await comentariosService.crear(propiedadId, dto);
        res.status(201).json(comentario);
    }

    async listar(req: Request, res: Response) {
        const propiedadId = Number(req.params.id);

        if (!Number.isInteger(propiedadId) || propiedadId <= 0) {
            res.status(404).json({
                error: "Propiedad no encontrada",
            });
            return;
        }

        const comentarios = await comentariosService.listarPorPropiedad(propiedadId);
        res.status(200).json(comentarios);
    }

    async responder(req: Request, res: Response) {
        const comentarioId = Number(req.params.id);

        if (!Number.isInteger(comentarioId) || comentarioId <= 0) {
            res.status(404).json({
                error: "Comentario no encontrado",
            });
            return;
        }

        const dto = plainToInstance(ResponderComentarioDto, req.body);

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

        const comentario = await comentariosService.responder(comentarioId, dto, req.vendedorId!);
        res.status(200).json(comentario);
    }
}

export const comentariosController = new ComentariosController();