import { Router } from "express";
import { healthRouter } from "./health.routes";
import { propiedadesRouter } from "./propiedades.routes";
import { inmobiliariasRouter } from "./inmobiliarias.routes";
import { comentariosRouter } from "./comentarios.routes";
import { authRouter } from "./auth.routes";
import { solicitudesVisitaRouter } from "./solicitudes-visita.routes";
import { actividadesRouter } from "./actividades.routes";

export const router = Router();


router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/properties", propiedadesRouter);
router.use("/agencies", inmobiliariasRouter);
router.use("/comments", comentariosRouter);
router.use("/visit-requests", solicitudesVisitaRouter);
router.use("/activity", actividadesRouter);
