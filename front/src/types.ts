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

export type RegistrarDto = {
    nombre: string;
    apellido: string;
    email: string;
    contrasenia: string;
    telefono?: string;
    nombreInmobiliaria: string;
};

export type PropiedadPanel = {
    id: number;
    titulo: string;
    tipo: "CASA" | "DEPARTAMENTO" | "TERRENO" | "LOCAL";
    operacion: "VENTA" | "ALQUILER";
    precio: string;
    moneda: "ARS" | "USD";
    zona: string;
    fotos: string[];
    fotoPortada: string;
    estado:
    | "BORRADOR"
    | "PUBLICADA"
    | "RESERVADA"
    | "PAUSADA"
    | "VENDIDA"
    | "ALQUILADA"
    | "CANCELADA";
};

export type CrearPropiedadInput = {
    titulo: string;
    descripcion: string;
    tipo: "CASA" | "DEPARTAMENTO" | "TERRENO" | "LOCAL";
    operacion: "VENTA" | "ALQUILER";
    precio: string;
    moneda: "ARS" | "USD";
    direccion: string;
    zona: string;
    superficieCubiertaM2?: string;
    superficieTotalM2: string;
    ambientes?: number;
    dormitorios?: number;
    banios?: number;
    antiguedadAnios?: number;
    amenities: string[];
    fotos: string[];
    fotoPortada: string;
};

export type PropiedadDetalle = {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: "CASA" | "DEPARTAMENTO" | "TERRENO" | "LOCAL";
    operacion: "VENTA" | "ALQUILER";
    precio: string;
    moneda: "ARS" | "USD";
    direccion: string;
    zona: string;
    superficieCubiertaM2: string | null;
    superficieTotalM2: string;
    ambientes: number | null;
    dormitorios: number | null;
    banios: number | null;
    antiguedadAnios: number | null;
    amenities: string[];
    fotos: string[];
    fotoPortada: string;
    estado:
    | "BORRADOR"
    | "PUBLICADA"
    | "RESERVADA"
    | "PAUSADA"
    | "VENDIDA"
    | "ALQUILADA"
    | "CANCELADA";
};

export type InmobiliariaDatos = {
    id: number;
    nombre: string;
    descripcion: string;
    logoUrl: string | null;
    telefonoContacto: string;
    emailContacto: string;
    direccionOficina: string | null;
};

export type ActualizarInmobiliariaInput = {
    nombre: string;
    descripcion: string;
    logoUrl?: string;
    telefonoContacto: string;
    emailContacto: string;
    direccionOficina?: string;
};

export type PropiedadPublica = {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: "CASA" | "DEPARTAMENTO" | "TERRENO" | "LOCAL";
    operacion: "VENTA" | "ALQUILER";
    precio: string;
    moneda: "ARS" | "USD";
    zona: string;
    ambientes: number | null;
    superficieTotalM2: string;
    amenities: string[];
    fotoPortada: string;
};

export type RespuestaPropiedades = {
    items: PropiedadPublica[];
    page: number;
    limit: number;
    total: number;
};

export type FiltrosPropiedades = {
    page?: number;
    limit?: number;
    tipo?: "CASA" | "DEPARTAMENTO" | "TERRENO" | "LOCAL";
    operacion?: "VENTA" | "ALQUILER";
    precioMin?: string;
    precioMax?: string;
    zona?: string;
    ambientes?: number;
    amenities?: string[];
    q?: string;
    sort?: "precio" | "fechaPublicacion" | "superficieTotal";
};