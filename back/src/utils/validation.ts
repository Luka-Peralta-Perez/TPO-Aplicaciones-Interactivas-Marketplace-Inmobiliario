import { ValidationError } from "class-validator";

export function obtenerDetallesValidacion(
    errores: ValidationError[]
) {
    return errores.map((error) => ({
        field: error.property,
        messages: Object.values(
            error.constraints ?? {}
        ),
    }));
}