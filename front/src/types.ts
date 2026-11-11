// Datos del vendedor que mantenemos durante la sesión
export type VendedorSesion = {
    id: number;
    nombreCompleto: string;
    email: string;
    telefono: string | null;
};

// Datos mínimos de la inmobiliaria que necesitamos en el panel
export type InmobiliariaSesion = {
    id: number;
    nombre: string;
};

// Toda la info que devuelve el login 
export type Sesion = {
    token: string;
    vendedor: VendedorSesion;
    inmobiliaria: InmobiliariaSesion;
};

// Errores que devuelve el back
export type ApiErrorResponse = {
    error: string;
    details?: unknown;
};