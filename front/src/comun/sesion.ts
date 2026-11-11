import type { Sesion } from "../types";

// Usamos una clave única para guaradr toda la sesión en localStorage
const CLAVE_SESION = "sesion-vendedor";

export function guardarSesion(sesion: Sesion) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

// Recupera la sesión guardada cuando el usuario recarga la pantalla
export function obtenerSesion(): Sesion | null {
    const sesionGuardada = localStorage.getItem(CLAVE_SESION);

    if (!sesionGuardada) {
        return null;
    }

    try {
        return JSON.parse(sesionGuardada) as Sesion;
    } catch {
        localStorage.removeItem(CLAVE_SESION);
        return null;
    }
}

// Agrega automaticamente el JWT al header authorization
export function obtenerToken(): string | null {
    return obtenerSesion()?.token ?? null;
}

export function haySesion(): boolean {
    return obtenerToken() !== null;
}

export function limpiarSesion() {
    localStorage.removeItem(CLAVE_SESION);
}

