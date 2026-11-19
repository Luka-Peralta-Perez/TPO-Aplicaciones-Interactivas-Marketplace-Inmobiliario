import { useState } from "react";
import { ApiError } from "../comun/api";
import { authService } from "../services/auth";
import type { RegistrarDto } from "../types";

type ErroresFormulario = Partial<
    Record<
        | "nombre"
        | "apellido"
        | "email"
        | "contrasenia"
        | "confirmarContrasenia"
        | "telefono"
        | "nombreInmobiliaria",
        string
    >
>;

export function useRegistro() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
    const [telefono, setTelefono] = useState("");
    const [nombreInmobiliaria, setNombreInmobiliaria] = useState("");
    const [errores, setErrores] = useState<ErroresFormulario>({});
    const [errorGeneral, setErrorGeneral] = useState("");
    const [enviando, setEnviando] = useState(false);

    function validarFormulario() {
        const nuevosErrores: ErroresFormulario = {};

        if (!nombre.trim()) {
            nuevosErrores.nombre = "Ingresá tu nombre";
        } else if (nombre.trim().length > 60) {
            nuevosErrores.nombre = "El nombre no puede superar los 60 caracteres";
        }

        if (!apellido.trim()) {
            nuevosErrores.apellido = "Ingresá tu apellido";
        } else if (apellido.trim().length > 60) {
            nuevosErrores.apellido = "El apellido no puede superar los 60 caracteres";
        }

        if (!email.trim()) {
            nuevosErrores.email = "Ingresá tu email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            nuevosErrores.email = "Ingresá un email válido";
        }

        if (!contrasenia) {
            nuevosErrores.contrasenia = "Ingresá una contraseña";
        } else if (contrasenia.length < 6) {
            nuevosErrores.contrasenia = "La contraseña debe tener al menos 6 caracteres";
        }

        if (!confirmarContrasenia) {
            nuevosErrores.confirmarContrasenia = "Confirmá tu contraseña";
        } else if (contrasenia !== confirmarContrasenia) {
            nuevosErrores.confirmarContrasenia = "Las contraseñas no coinciden";
        }

        if (telefono.trim().length > 40) {
            nuevosErrores.telefono = "El teléfono no puede superar los 40 caracteres";
        }

        if (!nombreInmobiliaria.trim()) {
            nuevosErrores.nombreInmobiliaria = "Ingresá el nombre de la inmobiliaria";
        } else if (nombreInmobiliaria.trim().length > 120) {
            nuevosErrores.nombreInmobiliaria = "El nombre no puede superar los 120 caracteres";
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    }

    async function registrar() {
        setErrorGeneral("");

        if (!validarFormulario()) {
            return false;
        }

        const datos: RegistrarDto = {
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            email: email.trim(),
            contrasenia,
            nombreInmobiliaria: nombreInmobiliaria.trim(),
            ...(telefono.trim() && { telefono: telefono.trim() }),
        };

        try {
            setEnviando(true);
            await authService.register(datos);
            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 409) {
                    const details = error.details as { field?: string } | undefined;

                    if (details?.field === "email") {
                        setErrores((anteriores) => ({ ...anteriores, email: error.message }));
                        return false;
                    }

                    if (details?.field === "nombreInmobiliaria") {
                        setErrores((anteriores) => ({ ...anteriores, nombreInmobiliaria: error.message }));
                        return false;
                    }
                }

                setErrorGeneral(error.message);
            } else {
                setErrorGeneral("No se pudo completar el registro");
            }

            return false;
        } finally {
            setEnviando(false);
        }
    }

    return {
        nombre, setNombre,
        apellido, setApellido,
        email, setEmail,
        contrasenia, setContrasenia,
        confirmarContrasenia, setConfirmarContrasenia,
        telefono, setTelefono,
        nombreInmobiliaria, setNombreInmobiliaria,
        errores,
        errorGeneral,
        enviando,
        registrar,
    };
}