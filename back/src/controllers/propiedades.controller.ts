import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { propiedadesService } from "../services/propiedades.service";
import { CrearPropiedadDto, ActualizarPropiedadDto, FiltrarPropiedadesDto, CambiarEstadoPropiedadDto } from "./propiedades.dto";
import { obtenerDetallesValidacion } from "../utils/validation";

export class PropiedadesController {
    async listar(req: Request, res: Response) {
        // Los filtros llegan como query 
        const filtros = plainToInstance(FiltrarPropiedadesDto, req.query);

        const errores = await validate(filtros, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errores.length > 0) {
            res.status(400).json({
                error: "Filtros inválidos",
                details: obtenerDetallesValidacion(errores),
            });
            return;
        }

        const propiedades = await propiedadesService.listar(filtros);

        res.status(200).json(propiedades);
    }

    async obtener(req: Request, res: Response) {
        // Convertimos y validamos el id numérico recibido por parámaetro
        const id = Number(req.params.id);

        // Validamos que el parámetro sea un id válido
        if (!Number.isInteger(id) || id <= 0) {
            res.status(404).json({
                error: "Propiedad no encontrada",
            });
            return;
        }

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
                details: obtenerDetallesValidacion(errores),
            });
            return;
        }

        const propiedad = await propiedadesService.crear(dto, req.vendedorId!);

        res.status(201).json(propiedad);
    }

    async actualizar(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(404).json({
                error: "Propiedad no encontrada",
            });
            return;
        }

        const dto = plainToInstance(ActualizarPropiedadDto, req.body);

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

        const propiedad = await propiedadesService.actualizar(id, dto, req.vendedorId!);

        res.status(200).json(propiedad);
    }

    async cambiarEstado(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(404).json({
                error: "Propiedad no encontrada",
            });
            return;
        }

        const dto = plainToInstance(CambiarEstadoPropiedadDto, req.body);

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

        const propiedad = await propiedadesService.cambiarEstado(id, dto, req.vendedorId!);
        res.status(200).json(propiedad);
    }

    async obtenerHistorial(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(404).json({
                error: "Propiedad no encontrada",
            });
            return;
        }

        const historial = await propiedadesService.obtenerHistorial(id, req.vendedorId!);
        res.status(200).json(historial);
    }

    async eliminar(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(404).json({
                error: "Propiedad no encontrada",
            });
            return;
        }

        await propiedadesService.eliminar(id);

        res.status(204).send()
    }
}

export const propiedadesController = new PropiedadesController();