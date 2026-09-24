import { Router } from "express";
import { comentariosController } from "../controllers/comentarios.controller";
import { requireAuth } from "../middlewares/requireAuth";

export const comentariosRouter = Router()

comentariosRouter.patch("/:id/reply", requireAuth, (req, res) =>
    comentariosController.responder(req, res)
);