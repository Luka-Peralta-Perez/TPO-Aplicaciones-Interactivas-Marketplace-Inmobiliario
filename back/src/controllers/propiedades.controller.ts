import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { propiedadesService } from "../services/propiedades.service";
import { CrearPropiedadDto, ActualizarPropiedadDto } from "./propiedades.dto";

export class PropiedadesController {
    async listar(req: Request, res: Response) {
        const propiedades = await propiedadesService.listar();

        res.status(200).json(propiedades);
    }

    async obtener(req: Request, res: Response) {
        // Aseguro que el id sea string para que coincida con el service
        const id = String(req.params.id);

        const propiedad = await propiedadesService.obtener(id);

        res.status(200).json(propiedad);
    }

    async crear(req: Request, res: Response) {
        // Convierte el body recibido en una instancia del DTO para poder validar
        const dto = plainToInstance(CrearPropiedadDto, req.body);

        const errores = await validate(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errores.length > 0) {
            res.status(400).json({
                error: "Datos inválidos",
                detalles: errores,
            });
            return;
        }

        const propiedad = await propiedadesService.crear(dto);

        res.status(201).json(propiedad);
    }

    async actualizar(req: Request, res: Response) {
        const id = String(req.params.id);

        const dto = plainToInstance(ActualizarPropiedadDto, req.body);

        const errores = await validate(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errores.length > 0) {
            res.status(400).json({
                error: "Datos inválidos",
                detalles: errores,
            });
            return;
        } 

        const propiedad = await propiedadesService.actualizar(id, dto);

        res.status(200).json(propiedad);
    }

    async eliminar(req: Request, res: Response) {
        const id = String(req.params.id);

        await propiedadesService.eliminar(id);

        res.status(204).send()
    }
}

export const propiedadesController = new PropiedadesController();