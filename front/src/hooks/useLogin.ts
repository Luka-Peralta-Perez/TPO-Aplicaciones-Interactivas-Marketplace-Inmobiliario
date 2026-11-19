import { useState } from "react";
import { ApiError } from "../comun/api";
import { authService } from "../services/auth";
import { useAuth } from "../auth/useAuth";

type ErroresLogin = {
    email?: string;
    contrasenia?: string;
};

export function useLogin() {
    const [email, setEmail] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
    const [errores, setErrores] = useState<ErroresLogin>({});
    const [enviando, setEnviando] = useState(false);
    const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
    const { iniciarSesion } = useAuth();

    async function iniciar() {
        setErrores({});
        setErrorGeneral(null);

        const nuevosErrores: ErroresLogin = {};

        if (!email.trim()) {
            nuevosErrores.email = "Ingresá tu email.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            nuevosErrores.email = "Ingresá un email válido.";
        }

        if (!contrasenia) {
            nuevosErrores.contrasenia = "Ingresá tu contraseña.";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return false;
        }

        try {
            setEnviando(true);

            const sesion = await authService.login({
                email: email.trim(),
                contrasenia,
            });

            iniciarSesion(sesion);
            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorGeneral(error.message);

                if (error.status === 401) {
                    setContrasenia("");
                }
            } else {
                setErrorGeneral("No se pudo iniciar sesión.");
            }

            return false;
        } finally {
            setEnviando(false);
        }
    }

    return {
        email,
        setEmail,
        contrasenia,
        setContrasenia,
        mostrarContrasenia,
        setMostrarContrasenia,
        errores,
        enviando,
        errorGeneral,
        iniciar,
    };
}