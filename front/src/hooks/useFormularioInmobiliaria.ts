import { useCallback, useState } from "react";
import type { ActualizarInmobiliariaInput, InmobiliariaDatos } from "../types";

export type ErroresInmobiliaria = Partial<Record<
    "nombre" | "descripcion" | "telefonoContacto" | "emailContacto",
    string
>>;

export function useFormularioInmobiliaria() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [telefonoContacto, setTelefonoContacto] = useState("");
    const [emailContacto, setEmailContacto] = useState("");
    const [direccionOficina, setDireccionOficina] = useState("");
    const [errores, setErrores] = useState<ErroresInmobiliaria>({});

    const cargarDatos = useCallback((inmobiliaria: InmobiliariaDatos) => {
        setNombre(inmobiliaria.nombre);
        setDescripcion(inmobiliaria.descripcion);
        setLogoUrl(inmobiliaria.logoUrl ?? "");
        setTelefonoContacto(inmobiliaria.telefonoContacto);
        setEmailContacto(inmobiliaria.emailContacto);
        setDireccionOficina(inmobiliaria.direccionOficina ?? "");
        setErrores({});
    }, []);

    function validarFormulario() {
        const nuevosErrores: ErroresInmobiliaria = {};

        if (!nombre.trim()) {
            nuevosErrores.nombre = "Ingresá el nombre de la inmobiliaria.";
        }

        if (!descripcion.trim()) {
            nuevosErrores.descripcion = "Ingresá una descripción.";
        }

        if (!telefonoContacto.trim()) {
            nuevosErrores.telefonoContacto = "Ingresá un teléfono de contacto.";
        } else if (!/^[0-9]{4}-[0-9]{6}$/.test(telefonoContacto.trim())) {
            nuevosErrores.telefonoContacto = "Usá el formato 2254-111111";
        }

        if (!emailContacto.trim()) {
            nuevosErrores.emailContacto = "Ingresá un email de contacto.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailContacto.trim())) {
            nuevosErrores.emailContacto = "Ingresá un email válido.";
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    }

    function obtenerDatos(): ActualizarInmobiliariaInput {
        return {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            telefonoContacto: telefonoContacto.trim(),
            emailContacto: emailContacto.trim(),
            logoUrl: logoUrl.trim() ? logoUrl.trim() : undefined,
            direccionOficina: direccionOficina.trim() ? direccionOficina.trim() : undefined,
        };
    }

    return {
        nombre, setNombre,
        descripcion, setDescripcion,
        logoUrl, setLogoUrl,
        telefonoContacto, setTelefonoContacto,
        emailContacto, setEmailContacto,
        direccionOficina, setDireccionOficina,
        errores, setErrores,
        cargarDatos,
        validarFormulario,
        obtenerDatos,
    };
}

export type FormularioInmobiliariaHook = ReturnType<typeof useFormularioInmobiliaria>;