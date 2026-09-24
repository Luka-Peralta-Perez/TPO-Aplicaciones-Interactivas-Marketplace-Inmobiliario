import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/propiedades.errors";

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

    // Cualquier error no controlado responde como error interno del servidor
    console.error(error);

    res.status(500).json({
        error: "Error interno del servidor",
    });
}