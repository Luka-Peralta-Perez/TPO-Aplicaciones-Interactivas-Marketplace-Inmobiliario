import { apiFetch } from "../comun/api";
import type { Sesion, RegistrarDto } from "../types";

export type LoginDto = {
    email: string;
    contrasenia: string,
};

export const authService = {
    login(datos: LoginDto): Promise<Sesion> {
        return apiFetch<Sesion>("/auth/login", {
            method: "POST",
            body: JSON.stringify(datos),
            redirigirEn401: false,
        });
    },

    async register(datos: RegistrarDto): Promise<void> {
        await apiFetch<unknown>("/auth/register", {
            method: "POST",
            body: JSON.stringify(datos),
            redirigirEn401: false,
        });
    },
};