import { Router } from "express";
import { healthController } from "../controllers/health.controller";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => healthController.obtener(req, res));