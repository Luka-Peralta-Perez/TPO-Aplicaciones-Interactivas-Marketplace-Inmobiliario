import { Router } from "express";
import { propiedadesController } from "../controllers/propiedades.controller";

export const propiedadesRouter = Router();

propiedadesRouter.get("/", (req, res) =>
    propiedadesController.listar(req, res)
);

propiedadesRouter.get("/:id", (req, res) =>
    propiedadesController.obtener(req, res)
);

propiedadesRouter.post("/", (req, res) =>
    propiedadesController.crear(req, res)
);

propiedadesRouter.patch("/:id", (req, res) =>
    propiedadesController.actualizar(req, res)
);

propiedadesRouter.delete("/:id", (req, res) =>
    propiedadesController.eliminar(req, res)
);