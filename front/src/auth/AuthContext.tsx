import { createContext, useState, type ReactNode } from "react";
import { guardarSesion, limpiarSesion, obtenerSesion } from "../comun/sesion";
import type { Sesion } from "../types";

export type AuthContextType = {
    sesion: Sesion | null;
    estaAutenticado: boolean;
    iniciarSesion: (sesion: Sesion) => void;
    cerrarSesion: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [sesion, setSesion] =
        useState<Sesion | null>(() =>
            obtenerSesion()
        );

    // Guarda la sesión en el estado de React y en LocalStorage para que persista entre recargas
    function iniciarSesion(nuevaSesion: Sesion) {
        guardarSesion(nuevaSesion);
        setSesion(nuevaSesion);
    }

    // Elimina la sesion del estado de React como de LocalStorage
    function cerrarSesion() {
        limpiarSesion();
        setSesion(null);
    }

    const estaAutenticado = sesion !== null;

    return (
        <AuthContext.Provider
            value={{
                sesion,
                estaAutenticado,
                iniciarSesion,
                cerrarSesion,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}