import { Router } from "express";
import { propiedadesController } from "../controllers/propiedades.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { comentariosController } from "../controllers/comentarios.controller";
import { solicitudesVisitaController } from "../controllers/solicitudes-visita.controller";

export const propiedadesRouter = Router();

propiedadesRouter.get("/", (req, res) =>
    propiedadesController.listar(req, res)
);

propiedadesRouter.get("/:id", (req, res) =>
    propiedadesController.obtener(req, res)
);

propiedadesRouter.get("/:id/comments", (req, res) =>
    comentariosController.listar(req, res)
);

propiedadesRouter.post("/:id/comments", (req, res) =>
    comentariosController.crear(req, res)
);

propiedadesRouter.post("/:id/visit-requests", (req, res) =>
    solicitudesVisitaController.crear(req, res)
);

propiedadesRouter.get("/:id/status-history", requireAuth, (req, res) =>
    propiedadesController.obtenerHistorial(req, res)
);

propiedadesRouter.patch("/:id/status", requireAuth, (req, res) =>
    propiedadesController.cambiarEstado(req, res)
);

propiedadesRouter.post("/", requireAuth, (req, res) =>
    propiedadesController.crear(req, res)
);

propiedadesRouter.put("/:id", requireAuth, (req, res) =>
    propiedadesController.actualizar(req, res)
);

propiedadesRouter.delete("/:id", requireAuth, (req, res) =>
    propiedadesController.eliminar(req, res)
);