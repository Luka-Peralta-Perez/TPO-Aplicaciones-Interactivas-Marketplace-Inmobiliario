import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { CrearPropiedadInput, PropiedadDetalle } from "../../types";
import styles from "../NuevaPropiedad/NuevaPropiedad.module.css";

const AMENITIES = [
    "pileta",
    "cochera",
    "jardin",
    "balcon",
    "ascensor",
    "parrilla",
    "apto profesional",
    "admite mascotas"
];

export default function EditarPropiedad() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [propiedad, setPropiedad] = useState<PropiedadDetalle | null>(null);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipo, setTipo] = useState<CrearPropiedadInput["tipo"]>("CASA");
    const [operacion, setOperacion] = useState<CrearPropiedadInput["operacion"]>("VENTA");
    const [precio, setPrecio] = useState("");
    const [moneda, setMoneda] = useState<CrearPropiedadInput["moneda"]>("USD");
    const [direccion, setDireccion] = useState("");
    const [zona, setZona] = useState("");
    const [superficieCubiertaM2, setSuperficieCubiertaM2] = useState("");
    const [superficieTotalM2, setSuperficieTotalM2] = useState("");
    const [ambientes, setAmbientes] = useState("");
    const [dormitorios, setDormitorios] = useState("");
    const [banios, setBanios] = useState("");
    const [antiguedadAnios, setAntiguedadAnios] = useState("");
    const [amenities, setAmenities] = useState<string[]>([]);
    const [fotos, setFotos] = useState<string[]>([""]);
    const [fotoPortada, setFotoPortada] = useState("");
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function cargarPropiedad() {
            const propiedadId = Number(id);

            if (!propiedadId) {
                setError("Propiedad inválida.");
                setCargando(false);
                return;
            }

            try {
                const datos = await propiedadesService.obtener(propiedadId);
                
                setPropiedad(datos);
                setTitulo(datos.titulo);
                setDescripcion(datos.descripcion);
                setTipo(datos.tipo);
                setOperacion(datos.operacion);
                setPrecio(datos.precio);
                setMoneda(datos.moneda);
                setDireccion(datos.direccion);
                setZona(datos.zona);
                setSuperficieCubiertaM2(datos.superficieCubiertaM2 ?? "");
                setSuperficieTotalM2(datos.superficieTotalM2);
                setAmbientes(datos.ambientes?.toString() ?? "");
                setDormitorios(datos.dormitorios?.toString() ?? "");
                setBanios(datos.banios?.toString() ?? "");
                setAntiguedadAnios(datos.antiguedadAnios?.toString() ?? "");
                setAmenities(datos.amenities);
                setFotos(datos.fotos.length > 0 
                    ? datos.fotos
                    : [""]
                );
                setFotoPortada(datos.fotoPortada);
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudo cargar la propiedad");
                }
            } finally {
                setCargando(false);
            }
        }
        cargarPropiedad();
    }, [id]);

    function cambiarAmenity(amenity: string) {
        if (amenities.includes(amenity)) {
            setAmenities(amenities.filter((item) => item !== amenity));
        } else {
            setAmenities([...amenities, amenity]);
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
        setFotos([...fotos, ""]);
    }

    function eliminarFoto(indice: number) {
        const fotoEliminada = fotos[indice];
        const fotosActualizadas = fotos.filter((_, posicion) => posicion !== indice);

        setFotos(fotosActualizadas.length > 0 ? fotosActualizadas : [""]);

        if (fotoPortada === fotoEliminada) {
            setFotoPortada("");
        }
    }

    function moverFoto(indice: number, direccion: number) {
        const nuevaPosicion = indice + direccion;

        if (nuevaPosicion < 0 || nuevaPosicion >= fotos.length) {
            return;
        }

        const fotosActualizadas = [...fotos];
        const fotoActual = fotosActualizadas[indice];

        fotosActualizadas[indice] = fotosActualizadas[nuevaPosicion];
        fotosActualizadas[nuevaPosicion] = fotoActual;

        setFotos(fotosActualizadas);
    }

    async function manejarSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const propiedadActual = propiedad;

        if (!propiedadActual) {
            return;
        }

        setError(null);

        const fotosLimpias = fotos
            .map((foto) => foto.trim())
            .filter((foto) => foto !== "");

        const portada = fotoPortada.trim();

        if (fotosLimpias.length === 0) {
            setError("Tenés que agregar al menos una foto.")
            return;
        }

        if (!portada) {
            setError("tenés que elegir una foto de portada.");
            return;
        }

        if (!fotosLimpias.includes(portada)) {
            setError("La foto de portada tiene que pertenecer a la galería de fotos.")
            return;
        }

        const esTerreno = tipo === "TERRENO";
        const datos: CrearPropiedadInput = {
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            tipo,
            operacion,
            precio,
            moneda,
            direccion: direccion.trim(),
            zona: zona.trim(),
            superficieCubiertaM2: !esTerreno && superficieCubiertaM2 ? superficieCubiertaM2 : undefined,
            superficieTotalM2,
            ambientes: !esTerreno && ambientes ? Number(ambientes) : undefined,
            dormitorios: !esTerreno && dormitorios ? Number(dormitorios) : undefined,
            banios: !esTerreno && banios ? Number(banios) : undefined,
            antiguedadAnios: !esTerreno && antiguedadAnios ? Number(banios) : undefined,
            amenities,
            fotos: fotosLimpias,
            fotoPortada: portada,
        };

        try {
            setGuardando(true);
            await propiedadesService.actualizar(propiedad.id, datos);
            navigate("/panel/propiedades");
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("No se pudo actualizar la propiedad");
            }
        } finally {
            setGuardando(false);
        }
    }

    if (cargando) {
        return <p>Cargando propiedad...</p>
    }

    if(!propiedad) {
        return (
            <section className={styles.contenedor}>
                <p className={styles.error}>
                    {error ?? "No se encontró la propiedad"}
                </p>
                <button
                type="button"
                className={styles.botonSecundario}
                onClick={() => navigate("/panel/propiedades")}>
                    Volver
                </button>
            </section>
        );
    }

    if (
        propiedad.estado === "VENDIDA" ||
        propiedad.estado === "ALQUILADA" ||
        propiedad.estado === "CANCELADA"
    ) {
        return (
            <section className={styles.contenedor}>
                <h1>Editar propiedad</h1>
                <p>
                    Esta propiedad no puede editarse porque su estado actual es {" "}
                    <strong>{propiedad.estado}</strong>
                </p>
                <button
                type="button"
                className={styles.botonSecundario}
                onClick={() => navigate("/panel/propiedades")}>
                    Volver
                </button>
            </section>
        );
    }
    return (
        <section className={styles.contenedor}>
            <div className={styles.encabezado}>
                <div>
                    <h1>Editar propiedad</h1>
                    <p>
                        Modificá los datos actuales de la propiedad.
                    </p>
                </div>
                <button 
                type="button"
                className={styles.botonSecundario}
                onClick={() => navigate("/panel/propiedades")}>
                    Volver
                </button>
            </div>
            <form
                className={styles.formulario}
                onSubmit={manejarSubmit}>
                <div className={styles.seccion}>
                    <h2>Información principal</h2>
                    <div className={styles.campoCompleto}>
                        <label htmlFor="titulo">
                            Título
                        </label>
                        <input
                            id="titulo"
                            type="text"
                            value={titulo}
                            onChange={(event) => setTitulo(event.target.value)}
                            maxLength={160}
                            required />
                    </div>

                    <div className={styles.campoCompleto}>
                        <label htmlFor="descripcion">
                            Descripción
                        </label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(event) => setDescripcion(event.target.value)}
                            rows={5}
                            required />
                    </div>

                    <div className={styles.grilla}>
                        <div className={styles.campo}>
                            <label htmlFor="tipo">
                                Tipo
                            </label>
                            <select
                                id="tipo"
                                value={tipo}
                                onChange={(event) => setTipo(event.target.value as CrearPropiedadInput["tipo"])}>
                                <option value="CASA">
                                    Casa
                                </option>
                                <option value="DEPARTAMENTO">
                                    Departamento
                                </option>
                                <option value="TERRENO">
                                    Terreno
                                </option>
                                <option value="LOCAL">
                                    Local
                                </option>
                            </select>
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="operacion">
                                Operación
                            </label>
                            <select
                                id="operacion"
                                value={operacion}
                                onChange={(event) => setOperacion(event.target.value as CrearPropiedadInput["operacion"])}>
                                <option value="VENTA">
                                    Venta
                                </option>
                                <option value="ALQUILER">
                                    Alquiler
                                </option>
                            </select>
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="precio">
                                Precio
                            </label>
                            <input
                                id="precio"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={precio}
                                onChange={(event) => setPrecio(event.target.value)}
                                required />
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="moneda">
                                Moneda
                            </label>
                            <select
                                id="moneda"
                                value={moneda}
                                onChange={(event) => setMoneda(event.target.value as CrearPropiedadInput["moneda"])}>
                                <option value="USD">
                                    USD
                                </option>
                                <option value="ARS">
                                    ARS
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.seccion}>
                    <h2>Ubicación</h2>
                    <div className={styles.grilla}>
                        <div className={styles.campo}>
                            <label htmlFor="direccion">
                                Dirección
                            </label>
                            <input
                                id="direccion"
                                type="text"
                                value={direccion}
                                onChange={(event) => setDireccion(event.target.value)}
                                maxLength={255}
                                required />
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="zona">
                                Zona
                            </label>
                            <input
                                id="zona"
                                type="text"
                                value={zona}
                                onChange={(event) => setZona(event.target.value)}
                                maxLength={120}
                                required />
                        </div>
                    </div>
                </div>

                <div className={styles.seccion}>
                    <h2>Características</h2>
                    <div className={styles.grilla}>
                        <div className={styles.campo}>
                            <label htmlFor="superficieTotal">
                                Superficie total (m²)
                            </label>
                            <input
                                id="superficieTotal"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={superficieTotalM2}
                                onChange={(event) => setSuperficieTotalM2(event.target.value)}
                                required />
                        </div>

                        {tipo !== "TERRENO" && (
                            <>
                                <div className={styles.campo}>
                                    <label htmlFor="superficieCubierta">
                                        Superficie cubierta (m²)
                                    </label>
                                    <input
                                        id="superficieCubierta"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={superficieCubiertaM2}
                                        onChange={(event) => setSuperficieCubiertaM2(event.target.value)}
                                    />
                                </div>

                                <div className={styles.campo}>
                                    <label htmlFor="ambientes">
                                        Ambientes
                                    </label>
                                    <input
                                        id="ambientes"
                                        type="number"
                                        min="1"
                                        value={ambientes}
                                        onChange={(event) => setAmbientes(event.target.value)}
                                    />
                                </div>

                                <div className={styles.campo}>
                                    <label htmlFor="dormitorios">
                                        Dormitorios
                                    </label>
                                    <input
                                        id="dormitorios"
                                        type="number"
                                        min="1"
                                        value={dormitorios}
                                        onChange={(event) => setDormitorios(event.target.value)}
                                    />
                                </div>

                                <div className={styles.campo}>
                                    <label htmlFor="banios">
                                        Baños
                                    </label>
                                    <input
                                        id="banios"
                                        type="number"
                                        min="1"
                                        value={banios}
                                        onChange={(event) => setBanios(event.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <div className={styles.campo}>
                            <label htmlFor="antiguedad">
                                Antigüedad
                            </label>
                            <input
                                id="antiguedad"
                                type="number"
                                min="0"
                                value={antiguedadAnios}
                                onChange={(event) => setAntiguedadAnios(event.target.value)} />
                        </div>
                    </div>
                </div>

                <div className={styles.seccion}>
                    <h2>Amenities</h2>
                    <div className={styles.amenities}>
                        {AMENITIES.map((amenity) => (
                            <label
                                key={amenity}
                                className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={amenities.includes(amenity)}
                                    onChange={() => cambiarAmenity(amenity)} />
                                {amenity}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.seccion}>
                    <div className={styles.encabezadoFotos}>
                        <div>
                            <h2>Fotos</h2>
                            <p>
                                Podés modificar, agregar, eliminar y ordenar las fotos.
                            </p>
                        </div>
                        <button
                            type="button"
                            className={styles.botonSecundario}
                            onClick={agregarFoto}>
                            Agregar foto
                        </button>
                    </div>

                    <div className={styles.listaFotos}>
                        {fotos.map((foto, indice) => (
                            <div
                                className={styles.foto}
                                key={indice}>
                                <div className={styles.datosFoto}>
                                    <label>
                                        Foto {indice + 1}
                                    </label>

                                    <input
                                        type="text"
                                        value={foto}
                                        onChange={(event) => actualizarFoto(indice, event.target.value)} />
                                    <label className={styles.portada}>
                                        <input
                                            type="radio"
                                            name="fotoPortada"
                                            checked={foto !== "" && fotoPortada === foto}
                                            disabled={foto.trim() === ""}
                                            onChange={() => setFotoPortada(foto)} />

                                        Usar como portada
                                    </label>

                                    <div className={styles.accionesFoto}>
                                        <button
                                            type="button"
                                            onClick={() => moverFoto(indice, -1)}
                                            disabled={indice === 0}>
                                            ↑
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => moverFoto(indice, 1)}
                                            disabled={indice === fotos.length - 1}>
                                            ↓
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => eliminarFoto(indice)}>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                {foto.trim() && (
                                    <img
                                        src={foto}
                                        alt={`Vista previa ${indice + 1
                                            }`}
                                        className={styles.previsualizacion} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {error && (
                    <p className={styles.error}>
                        {error}
                    </p>
                )}

                <div className={styles.acciones}>
                    <button
                        type="button"
                        className={styles.botonSecundario}
                        onClick={() => navigate("/panel/propiedades")}
                        disabled={guardando}>
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className={styles.botonPrincipal}
                        disabled={guardando}>
                        {guardando ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </form>
        </section>
    );
}