import { Router } from "express";
import { propiedadesRouter } from "./propiedades.routes";

export const router = Router();

router.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

router.use("/propiedades", propiedadesRouter);