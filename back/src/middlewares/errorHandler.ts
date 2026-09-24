import { NextFunction, Request, Response } from "express";
import { NotFoundError, BadRequestError } from "../errors/propiedades.errors";
import { ConflictError } from "../errors/inmobiliaria.errors";
import { UnauthorizedError, ForbiddenError } from "../errors/auth.errors";

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error instanceof NotFoundError) {
        res.status(404).json({
            error: error.message,
        });
        return;
    }

    if (error instanceof BadRequestError) {
        res.status(400).json({
            error: error.message,
        });
        return;
    }

    if (error instanceof ConflictError) {
        res.status(409).json({
            error: error.message,
        });
        return;
    }

    if (error instanceof UnauthorizedError) {
        res.status(401).json({
            error: error.message,
        });
        return;
    }

    if (error instanceof ForbiddenError) {
        res.status(403).json({
            error: error.message,
        });
        return;
    }

    // Cualquier error no controlado responde como error interno del servidor
    console.error(error);

    res.status(500).json({
        error: "Error interno del servidor",
    });
}