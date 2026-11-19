import { useCallback, useState } from "react";
import type { CrearPropiedadInput } from "../types";

export type ErroresPropiedad = Partial<
    Record<
        | "titulo"
        | "descripcion"
        | "precio"
        | "direccion"
        | "zona"
        | "superficieTotalM2"
        | "superficieCubiertaM2"
        | "ambientes"
        | "dormitorios"
        | "banios"
        | "antiguedadAnios"
        | "fotos"
        | "fotoPortada",
        string
    >
>;

export const AMENITIES = [
    "pileta",
    "cochera",
    "jardin",
    "balcon",
    "ascensor",
    "parrilla",
    "apto profesional",
    "admite mascotas",
];

export type DatosInicialesFormularioPropiedad = {
    titulo?: string;
    descripcion?: string;
    tipo?: CrearPropiedadInput["tipo"];
    operacion?: CrearPropiedadInput["operacion"];
    precio?: string;
    moneda?: CrearPropiedadInput["moneda"];
    direccion?: string;
    zona?: string;
    superficieCubiertaM2?: string;
    superficieTotalM2?: string;
    ambientes?: string;
    dormitorios?: string;
    banios?: string;
    antiguedadAnios?: string;
    amenities?: string[];
    fotos?: string[];
    fotoPortada?: string;
};

export function useFormularioPropiedad(datosIniciales: DatosInicialesFormularioPropiedad = {}) {
    const [titulo, setTitulo] = useState(datosIniciales.titulo ?? "");
    const [descripcion, setDescripcion] = useState(datosIniciales.descripcion ?? "");
    const [tipo, setTipo] = useState<CrearPropiedadInput["tipo"]>(datosIniciales.tipo ?? "CASA");
    const [operacion, setOperacion] = useState<CrearPropiedadInput["operacion"]>(
        datosIniciales.operacion ?? "VENTA"
    );
    const [precio, setPrecio] = useState(datosIniciales.precio ?? "");
    const [moneda, setMoneda] = useState<CrearPropiedadInput["moneda"]>(
        datosIniciales.moneda ?? "USD"
    );
    const [direccion, setDireccion] = useState(datosIniciales.direccion ?? "");
    const [zona, setZona] = useState(datosIniciales.zona ?? "");
    const [superficieCubiertaM2, setSuperficieCubiertaM2] = useState(datosIniciales.superficieCubiertaM2 ?? "");
    const [superficieTotalM2, setSuperficieTotalM2] = useState(datosIniciales.superficieTotalM2 ?? "");
    const [ambientes, setAmbientes] = useState(datosIniciales.ambientes ?? "");
    const [dormitorios, setDormitorios] = useState(datosIniciales.dormitorios ?? "");
    const [banios, setBanios] = useState(datosIniciales.banios ?? "");
    const [antiguedadAnios, setAntiguedadAnios] = useState(datosIniciales.antiguedadAnios ?? "");
    const [amenities, setAmenities] = useState<string[]>(datosIniciales.amenities ?? []);
    const [fotos, setFotos] = useState<string[]>(
        datosIniciales.fotos?.length
            ? datosIniciales.fotos
            : [""]
    );
    const [fotoPortada, setFotoPortada] = useState(datosIniciales.fotoPortada ?? "");
    const [errores, setErrores] = useState<ErroresPropiedad>({});

    function cambiarAmenity(amenity: string) {
        if (amenities.includes(amenity)) {
            setAmenities(
                amenities.filter(
                    (item) => item !== amenity
                )
            );
        } else {
            setAmenities([
                ...amenities,
                amenity,
            ]);
        }
    }

    function actualizarFoto(indice: number, valor: string) {
        const fotosActualizadas = [...fotos];
        const fotoAnterior = fotosActualizadas[indice];

        fotosActualizadas[indice] = valor;
        setFotos(fotosActualizadas);

        if (fotoPortada === fotoAnterior) {
            setFotoPortada(valor);
        }
    }

    function agregarFoto() {
        setFotos([
            ...fotos,
            "",
        ]);
    }

    function eliminarFoto(indice: number) {
        const fotoEliminada = fotos[indice];

        const fotosActualizadas =
            fotos.filter(
                (_, posicion) => posicion !== indice
            );

        setFotos(
            fotosActualizadas.length > 0
                ? fotosActualizadas
                : [""]
        );

        if (fotoPortada === fotoEliminada) {
            setFotoPortada("");
        }
    }

    function moverFoto(indice: number, direccion: number) {
        const nuevaPosicion = indice + direccion;

        if (nuevaPosicion < 0 || nuevaPosicion >= fotos.length) {
            return;
        }

        const fotosActualizadas = [...fotos,];
        const fotoActual = fotosActualizadas[indice];

        fotosActualizadas[indice] = fotosActualizadas[nuevaPosicion];
        fotosActualizadas[nuevaPosicion] = fotoActual;

        setFotos(fotosActualizadas);
    }

    function validarFormulario() {
        const nuevosErrores: ErroresPropiedad = {};

        if (!titulo.trim()) {
            nuevosErrores.titulo = "Ingresá un título.";
        }

        if (!descripcion.trim()) {
            nuevosErrores.descripcion = "Ingresá una descripción.";
        }

        if (!precio) {
            nuevosErrores.precio = "Ingresá un precio.";
        } else if (Number(precio) <= 0) {
            nuevosErrores.precio = "El precio debe ser mayor a 0.";
        }

        if (!direccion.trim()) {
            nuevosErrores.direccion = "Ingresá una dirección.";
        }

        if (!zona.trim()) {
            nuevosErrores.zona = "Ingresá una zona.";
        }

        if (!superficieTotalM2) {
            nuevosErrores.superficieTotalM2 = "Ingresá la superficie total.";
        } else if (Number(superficieTotalM2) <= 0) {
            nuevosErrores.superficieTotalM2 = "La superficie total debe ser mayor a 0.";
        }

        if (tipo !== "TERRENO") {
            if (superficieCubiertaM2 && Number(superficieCubiertaM2) <= 0) {
                nuevosErrores.superficieCubiertaM2 = "La superficie cubierta debe ser mayor a 0.";
            }

            if (ambientes && Number(ambientes) < 1) {
                nuevosErrores.ambientes = "La cantidad de ambientes debe ser al menos 1.";
            }

            if (dormitorios && Number(dormitorios) < 1) {
                nuevosErrores.dormitorios = "La cantidad de dormitorios debe ser al menos 1.";
            }

            if (banios && Number(banios) < 1) {
                nuevosErrores.banios = "La cantidad de baños debe ser al menos 1.";
            }
        }

        if (tipo !== "TERRENO" &&
            antiguedadAnios &&
            Number(antiguedadAnios) < 0) {
            nuevosErrores.antiguedadAnios = "La antigüedad no puede ser negativa.";
        }

        const fotosLimpias = fotos
            .map((foto) => foto.trim())
            .filter((foto) => foto !== "");

        if (fotosLimpias.length === 0) {
            nuevosErrores.fotos = "Tenés que agregar al menos una foto.";
        }

        const portada =
            fotoPortada.trim();

        if (!portada) {
            nuevosErrores.fotoPortada = "Tenés que elegir una foto de portada.";
        } else if (
            !fotosLimpias.includes(portada)
        ) {
            nuevosErrores.fotoPortada = "La foto de portada tiene que pertenecer a la galería.";
        }

        setErrores(nuevosErrores);

        return (Object.keys(nuevosErrores).length === 0);
    }

    function obtenerDatos(): CrearPropiedadInput {
        const fotosLimpias = fotos
            .map((foto) => foto.trim())
            .filter((foto) => foto !== "");

        const portada = fotoPortada.trim();
        const esTerreno = tipo === "TERRENO";

        return {
            titulo: titulo.trim(),
            descripcion:
                descripcion.trim(),
            tipo,
            operacion,
            precio,
            moneda,
            direccion:
                direccion.trim(),
            zona:
                zona.trim(),

            superficieCubiertaM2:
                !esTerreno && superficieCubiertaM2
                    ? superficieCubiertaM2
                    : undefined,

            superficieTotalM2,

            ambientes:
                !esTerreno && ambientes
                    ? Number(ambientes)
                    : undefined,

            dormitorios:
                !esTerreno && dormitorios
                    ? Number(dormitorios)
                    : undefined,

            banios:
                !esTerreno && banios
                    ? Number(banios)
                    : undefined,

            antiguedadAnios:
                !esTerreno && antiguedadAnios
                    ? Number(antiguedadAnios)
                    : undefined,

            amenities,
            fotos: fotosLimpias,
            fotoPortada: portada,
        };
    }

    const cargarDatos = useCallback(
        (
            datos: DatosInicialesFormularioPropiedad
        ) => {
            setTitulo(datos.titulo ?? "");
            setDescripcion(datos.descripcion ?? "");
            setTipo(datos.tipo ?? "CASA");
            setOperacion(datos.operacion ?? "VENTA");
            setPrecio(datos.precio ?? "");
            setMoneda(datos.moneda ?? "USD");
            setDireccion(datos.direccion ?? "");
            setZona(datos.zona ?? "");
            setSuperficieCubiertaM2(datos.superficieCubiertaM2 ?? "");
            setSuperficieTotalM2(datos.superficieTotalM2 ?? "");
            setAmbientes(datos.ambientes ?? "");
            setDormitorios(datos.dormitorios ?? "");
            setBanios(datos.banios ?? "");
            setAntiguedadAnios(datos.antiguedadAnios ?? "");
            setAmenities(datos.amenities ?? []);
            setFotos(
                datos.fotos?.length
                    ? datos.fotos
                    : [""]
            );
            setFotoPortada(datos.fotoPortada ?? "");
            setErrores({});
        },
        []
    );

    return {
        titulo,
        setTitulo,

        descripcion,
        setDescripcion,

        tipo,
        setTipo,

        operacion,
        setOperacion,

        precio,
        setPrecio,

        moneda,
        setMoneda,

        direccion,
        setDireccion,

        zona,
        setZona,

        superficieCubiertaM2,
        setSuperficieCubiertaM2,

        superficieTotalM2,
        setSuperficieTotalM2,

        ambientes,
        setAmbientes,

        dormitorios,
        setDormitorios,

        banios,
        setBanios,

        antiguedadAnios,
        setAntiguedadAnios,

        amenities,
        fotos,

        fotoPortada,
        setFotoPortada,

        errores,
        setErrores,

        cambiarAmenity,
        actualizarFoto,
        agregarFoto,
        eliminarFoto,
        moverFoto,

        validarFormulario,
        obtenerDatos,
        cargarDatos,
    };
}

export type FormularioPropiedadHook = ReturnType<typeof useFormularioPropiedad>;