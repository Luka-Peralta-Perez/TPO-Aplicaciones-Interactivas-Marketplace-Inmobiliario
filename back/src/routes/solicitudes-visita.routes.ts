import { Router } from "express";
import { solicitudesVisitaController, SolicitudesVisitaController } from "../controllers/solicitudes-visita.controller";
import { requireAuth } from "../middlewares/requireAuth";

export const solicitudesVisitaRouter = Router();

solicitudesVisitaRouter.patch("/:id/status", requireAuth, (req, res) =>
    solicitudesVisitaController.cambiarEstado(req, res)
);