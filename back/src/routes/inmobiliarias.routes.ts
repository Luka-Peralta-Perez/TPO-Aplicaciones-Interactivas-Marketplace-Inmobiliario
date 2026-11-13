import { Router } from "express";
import { inmobiliariasController } from "../controllers/inmobiliarias.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { solicitudesVisitaController } from "../controllers/solicitudes-visita.controller";
import { reseniasController } from "../controllers/resenias.controller";
import { actividadesController } from "../controllers/actividades.controller";
import { reportesController } from "../controllers/reportes.controller";
import { comentariosController } from "../controllers/comentarios.controller";

export const inmobiliariasRouter = Router();

inmobiliariasRouter.get("/mine", requireAuth, (req, res) =>
    inmobiliariasController.obtenerPropia(req, res)
);

inmobiliariasRouter.get("/:id", (req, res) =>
    inmobiliariasController.obtener(req, res)
);

inmobiliariasRouter.post("/:id/reviews", (req, res) =>
    reseniasController.crear(req, res)
);

inmobiliariasRouter.get("/:id/reviews", (req, res) =>
    reseniasController.listar(req, res)
);

inmobiliariasRouter.put("/:id", requireAuth, (req, res) =>
    inmobiliariasController.actualizar(req, res)
);

inmobiliariasRouter.delete("/:id", requireAuth, (req, res) =>
    inmobiliariasController.eliminar(req, res)
);

inmobiliariasRouter.get("/:id/properties", (req, res) =>
    inmobiliariasController.listarPropiedades(req, res)
);

inmobiliariasRouter.get("/:id/visit-requests", requireAuth, (req, res) =>
    solicitudesVisitaController.listarPorInmobiliaria(req, res) 
);

inmobiliariasRouter.get("/:id/activity", requireAuth, (req, res) =>
    actividadesController.listar(req, res) 
);

inmobiliariasRouter.get("/:id/activity/unread-count", requireAuth, (req, res) =>
    actividadesController.contarNoLeidas(req, res) 
);

inmobiliariasRouter.get("/:id/reports/status-summary", requireAuth, (req, res) =>
    reportesController.resumenPorEstado(req, res)
);

inmobiliariasRouter.get("/:id/reports/monthly", requireAuth, (req, res) =>
    reportesController.resumenMensual(req, res) 
);

inmobiliariasRouter.get("/:id/reports/avg-time-on-market", requireAuth, (req, res) =>
    reportesController.promedioTiempoEnMercado(req, res) 
);

inmobiliariasRouter.get("/:id/comments", requireAuth, (req, res) => 
    comentariosController.listarPorInmobiliaria(req, res)
);