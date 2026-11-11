import type { ApiErrorResponse } from "../types";
import { limpiarSesion, obtenerToken } from "./sesion";

export const API_URL = import.meta.env.VITE_API_URL ??
    "http://localhost:3000";

export class ApiError extends Error {
    status: number;
    details?: unknown;

    constructor (
        status: number,
        message: string,
        details?: unknown
    ) {
        super (message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

// Extendemos RequestInit para poder decidir cuando un 401 tiene que redirigir al login
type ApiFetchOptions = RequestInit & {
    redirigirEn401?: boolean;
};

export async function apiFetch<T>(
    ruta: string,
    opciones: ApiFetchOptions = {}
): Promise<T> {
    const {
        redirigirEn401 = true,
        headers,
        ...opcionesFetch
    } = opciones;

    const token = obtenerToken();
    const headersFinales = new Headers(headers);

    if (token) {
        headersFinales.set(
            "Authorization",
            `Bearer ${token}`
        );
    }

    if (opcionesFetch.body &&
        !(opcionesFetch.body instanceof FormData) &&
        !headersFinales.has("Content-Type")
    ) {
        headersFinales.set(
            "Content-Type",
            "application/json"
        );
    }
    let respuesta: Response;

    try {
        respuesta = await fetch(`${API_URL}${ruta}`,
            {
                ...opcionesFetch,
                headers: headersFinales,
            }
        );
    } catch (error) {
        if (error instanceof Error &&
            error.name === "AbortError"
        ) {
            throw error;
        }

        throw new ApiError(0, "No se pudo conectar con la API");
    }

    let data: unknown = null;
    const contentType = respuesta.headers.get("content-type");

    if(respuesta.status !== 204 &&
        contentType?.includes("application/json")
    ) {
        data = await respuesta.json();
    }

    if (!respuesta.ok) {
        const errorApi = data as ApiErrorResponse | null;

        if (respuesta.status === 401 && redirigirEn401) {
            limpiarSesion();
            window.location.assign("/login");
        }

        throw new ApiError(
            respuesta.status,
            errorApi?.error ??
            `Error ${respuesta.status}`,
            errorApi?.details
        );
    }

    return data as T;
}