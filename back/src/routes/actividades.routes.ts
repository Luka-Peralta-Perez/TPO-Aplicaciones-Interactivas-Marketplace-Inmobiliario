import { Router } from "express";
import { actividadesController } from "../controllers/actividades.controller";
import { requireAuth } from "../middlewares/requireAuth";

export const actividadesRouter = Router();

actividadesRouter.patch("/:id/read", requireAuth, (req, res) => 
    actividadesController.marcarComoLeida(req, res)
);