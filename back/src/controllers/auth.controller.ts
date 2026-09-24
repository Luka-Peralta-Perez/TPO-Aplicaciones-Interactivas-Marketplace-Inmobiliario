import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RegistrarVendedorDto, LoginVendedorDto } from "./auth.dto";
import { authService } from "../services/auth.service";
import { obtenerDetallesValidacion } from "../utils/validation";

export class AuthController {
    async registrar(req: Request, res: Response) {
        const dto = plainToInstance(RegistrarVendedorDto, req.body);

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

        const resultado = await authService.registrar(dto);
        res.status(201).json(resultado);
    }

    async login(req: Request, res: Response) {
        const dto = plainToInstance(LoginVendedorDto, req.body);

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

        const resultado = await authService.login(dto);

        res.status(200).json(resultado);
    }
}

export const authController = new AuthController();