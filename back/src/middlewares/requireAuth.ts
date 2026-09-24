import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    // Extrae el token del encabezado
    const token = authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : undefined;

    if (!token ) {
        res.status(401).json({
            error: "Falta token"
        });
        return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if(!jwtSecret) {
        throw new Error("JWT_SECRET no está configurado");
    }

    try {
        const payload = jwt.verify(token, jwtSecret) as {
            vendedorId: number;
        };

        // Guarda el vendedor autenticado en la req para usarlo después
        req.vendedorId = payload.vendedorId;
        next();
    } catch {
        res.status(401).json({
            error: "Token inválido o expirado",
        });
    }
    
}