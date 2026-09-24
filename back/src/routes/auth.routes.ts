import { Router } from "express";
import { authController } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/register", (req, res) =>
    authController.registrar(req, res)
);

authRouter.post("/login", (req, res) =>
    authController.login(req, res)
);