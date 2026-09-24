import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { inmobiliariasService } from "../services/inmobiliarias.service";
import { ActualizarInmobiliariaDto } from "./inmobiliaria.dto";
import { obtenerDetallesValidacion } from "../utils/validation";

export class InmobiliariasController {
    async obtener(req: Request, res: Response) {
        const id = Number(req.params.id);

        // Validamos que el parámetro sea un id válido
        if (!Number.isInteger(id) || id <= 0) {
            res.status(404).json({
                error: "Inmobiliaria no encontrada",
            });
            return;
        }

        const inmobiliaria = await inmobiliariasService.obtener(id);

        res.status(200).json(inmobiliaria);
    }

    async actualizar(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(404).json({
                error: "Inmobiliaria no encontrada",
            });
            return;
        }

        const dto = plainToInstance(ActualizarInmobiliariaDto, req.body);

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

        const inmobiliaria = await inmobiliariasService.actualizar(id, dto, req.vendedorId!);

        res.status(200).json(inmobiliaria);
    }

    async eliminar(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(404).json({
                error: "Inmobiliaria no encontrada",
            });
            return;
        }

        await inmobiliariasService.eliminar(id, req.vendedorId!);

        res.status(204).send();
    }

    async listarPropiedades(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(404).json({
                error: "Inmobiliaria no encontrada",
            });
            return;
        }

        const propiedades = await inmobiliariasService.listarPropiedadesPublicadas(id);

        res.status(200).json(propiedades);
    }
}

export const inmobiliariasController = new InmobiliariasController();