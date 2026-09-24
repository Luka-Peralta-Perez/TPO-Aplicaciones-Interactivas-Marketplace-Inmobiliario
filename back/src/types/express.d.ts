import "express";

declare global {
    namespace Express {
        interface Request {
            vendedorId?: number;
        }
    }
}

export {};