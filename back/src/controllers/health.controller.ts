import { Request, Response } from "express";

export class HealthController {
    obtener(_req: Request, res: Response) {
        res.status(200).json({
            status: "ok",
        });
    }
}

export const healthController = new HealthController();