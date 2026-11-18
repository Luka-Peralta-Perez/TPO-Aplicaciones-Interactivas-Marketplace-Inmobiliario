import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { CrearPropiedadInput } from "../../types";
import styles from "./NuevaPropiedad.module.css";
import { DialogoConfirmacion } from "../../components/DialogoConfirmacion/DialogoConfirmacion";

type ErroresPropiedad = Partial<
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

export default function NuevaPropiedad() {
    const navigate = useNavigate();

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
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fotoAEliminar, setFotoAEliminar] = useState<number | null>(null);
    const [errores, setErrores] = useState<ErroresPropiedad>({});

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

    function confirmarEliminarFoto() {
        if (fotoAEliminar === null) {
            return;
        }
        eliminarFoto(fotoAEliminar);
        setFotoAEliminar(null);
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
            nuevosErrores.superficieTotalM2 =
                "Ingresá la superficie total.";
        } else if (Number(superficieTotalM2) <= 0) {
            nuevosErrores.superficieTotalM2 =
                "La superficie total debe ser mayor a 0.";
        }

        if (tipo !== "TERRENO") {
            if (
                superficieCubiertaM2 &&
                Number(superficieCubiertaM2) <= 0
            ) {
                nuevosErrores.superficieCubiertaM2 =
                    "La superficie cubierta debe ser mayor a 0.";
            }

            if (ambientes && Number(ambientes) < 1) {
                nuevosErrores.ambientes =
                    "La cantidad de ambientes debe ser al menos 1.";
            }

            if (dormitorios && Number(dormitorios) < 1) {
                nuevosErrores.dormitorios =
                    "La cantidad de dormitorios debe ser al menos 1.";
            }

            if (banios && Number(banios) < 1) {
                nuevosErrores.banios =
                    "La cantidad de baños debe ser al menos 1.";
            }
        }

        if (
            tipo !== "TERRENO" &&
            antiguedadAnios &&
            Number(antiguedadAnios) < 0
        ) {
            nuevosErrores.antiguedadAnios =
                "La antigüedad no puede ser negativa.";
        }

        const fotosLimpias = fotos
            .map((foto) => foto.trim())
            .filter((foto) => foto !== "");

        if (fotosLimpias.length === 0) {
            nuevosErrores.fotos =
                "Tenés que agregar al menos una foto.";
        }

        const portada = fotoPortada.trim();

        if (!portada) {
            nuevosErrores.fotoPortada =
                "Tenés que elegir una foto de portada.";
        } else if (!fotosLimpias.includes(portada)) {
            nuevosErrores.fotoPortada =
                "La foto de portada tiene que pertenecer a la galería.";
        }

        setErrores(nuevosErrores);

        return Object.keys(nuevosErrores).length === 0;
    }

    async function manejarSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrores({});
        setError(null);

        if (!validarFormulario()) {
            return;
        }

        const fotosLimpias = fotos
            .map((foto) => foto.trim())
            .filter((foto) => foto !== "");

        const portada = fotoPortada.trim();
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
            antiguedadAnios: !esTerreno && antiguedadAnios ? Number(antiguedadAnios) : undefined,
            amenities,
            fotos: fotosLimpias,
            fotoPortada: portada,
        };

        try {
            setGuardando(true);
            await propiedadesService.crear(datos);
            navigate("/panel/propiedades");
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("No se pudo crear la propiedad");
            }
        } finally {
            setGuardando(false);
        }
    }

    return (
        <section className={styles.contenedor}>
            <div className={styles.encabezado}>
                <div>
                    <h1>Nueva propiedad</h1>
                    <p>
                        Completá los datos de la propiedad.
                        Se guardará inicialmente como BORRADOR.
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
                onSubmit={manejarSubmit}
                noValidate>
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
                        {errores.titulo && (
                            <p className={styles.error}>
                                {errores.titulo}
                            </p>
                        )}
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
                        {errores.descripcion && (
                            <p className={styles.error}>
                                {errores.descripcion}
                            </p>
                        )}
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
                            {errores.precio && (
                                <p className={styles.error}>
                                    {errores.precio}
                                </p>
                            )}
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

                            {errores.direccion && (
                                <p className={styles.error}>
                                    {errores.direccion}
                                </p>
                            )}
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

                            {errores.zona && (
                                <p className={styles.error}>
                                    {errores.zona}
                                </p>
                            )}
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

                            {errores.superficieTotalM2 && (
                                <p className={styles.error}>
                                    {errores.superficieTotalM2}
                                </p>
                            )}
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
                                    {errores.superficieCubiertaM2 && (
                                        <p className={styles.error}>
                                            {errores.superficieCubiertaM2}
                                        </p>
                                    )}
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
                                    {errores.ambientes && (
                                        <p className={styles.error}>
                                            {errores.ambientes}
                                        </p>
                                    )}
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
                                    {errores.dormitorios && (
                                        <p className={styles.error}>
                                            {errores.dormitorios}
                                        </p>
                                    )}
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
                                    {errores.banios && (
                                        <p className={styles.error}>
                                            {errores.banios}
                                        </p>
                                    )}
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

                            {errores.antiguedadAnios && (
                                <p className={styles.error}>
                                    {errores.antiguedadAnios}
                                </p>
                            )}
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
                                Ingresá las URLs de las imágenes y elegí una como portada
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
                                        placeholder="https://..."
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
                                            onClick={() => setFotoAEliminar(indice)}>
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

                {errores.fotos && (
                    <p className={styles.error}>
                        {errores.fotos}
                    </p>
                )}

                {errores.fotoPortada && (
                    <p className={styles.error}>
                        {errores.fotoPortada}
                    </p>
                )}

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
                        {guardando ? "Guardando..." : "Crear propiedad"}
                    </button>
                </div>
            </form>

            <DialogoConfirmacion
                abierto={fotoAEliminar !== null}
                titulo="Eliminar foto"
                mensaje="¿Seguro que querés eliminar esta foto de la propiedad?"
                textoConfirmar="Eliminar"
                onConfirmar={confirmarEliminarFoto}
                onCancelar={() => setFotoAEliminar(null)}
            />

        </section>
    );
}