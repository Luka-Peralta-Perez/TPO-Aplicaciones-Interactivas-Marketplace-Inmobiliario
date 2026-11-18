import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { inmobiliariasService } from "../../services/inmobiliarias";
import type { ActualizarInmobiliariaInput, InmobiliariaDatos } from "../../types";
import styles from "./InmobiliariaPanel.module.css";
import { EstadoCarga, EstadoError } from "../../components/Estados/Estados";
import { DialogoConfirmacion } from "../../components/DialogoConfirmacion/DialogoConfirmacion";

type ErroresInmobiliaria = Partial<
    Record<
        | "nombre"
        | "descripcion"
        | "telefonoContacto"
        | "emailContacto",
        string
    >
>;

export default function InmobiliariaPanel() {
    const navigate = useNavigate();
    const [inmobiliaria, setInmobiliaria] = useState<InmobiliariaDatos | null>(null);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [telefonoContacto, setTelefonoContacto] = useState("");
    const [emailContacto, setEmailContacto] = useState("");
    const [direccionOficina, setDireccionOficina] = useState("");
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [errores, setErrores] = useState<ErroresInmobiliaria>({});

    useEffect(() => {
        async function cargarInmobiliaria() {
            try {
                setCargando(true);
                setError(null);

                const datos = await inmobiliariasService.obtenerPropia();

                setInmobiliaria(datos);
                setNombre(datos.nombre);
                setDescripcion(datos.descripcion);
                setLogoUrl(datos.logoUrl ?? "");
                setTelefonoContacto(datos.telefonoContacto);
                setEmailContacto(datos.emailContacto);
                setDireccionOficina(datos.direccionOficina ?? "");
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudo cargar la inmobiliaria.");
                }
            } finally {
                setCargando(false);
            }
        }
        cargarInmobiliaria();
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

    async function manejarSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrores({});
        setError(null);
        setMensaje(null);

        if (!validarFormulario()) {
            return;
        }

        if (!inmobiliaria) {
            return;
        }

        const datos: ActualizarInmobiliariaInput = {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            telefonoContacto: telefonoContacto.trim(),
            emailContacto: emailContacto.trim(),
            logoUrl: logoUrl.trim() ? logoUrl.trim() : undefined,
            direccionOficina: direccionOficina.trim() ? direccionOficina.trim() : undefined,
        };

        try {
            setGuardando(true);
            const actualizada = await inmobiliariasService.actualizar(inmobiliaria.id, datos);
            setInmobiliaria(actualizada);
            setMensaje("Los datos de la inmobiliaria se actualizaron correctamente!");
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("No se pudo actualizar la inmobiliaria");
            }
        } finally {
            setGuardando(false);
        }

    }

    async function confirmarEliminarInmobiliaria() {
        if (!inmobiliaria) {
            return;
        }
        setError(null);
        setMensaje(null)

        try {
            setEliminando(true);
            await inmobiliariasService.eliminar(inmobiliaria.id);
            navigate("/");
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("No se pudo eliminar la inmobiliaria.");
            }
        } finally {
            setEliminando(false);
            setMostrarConfirmacion(false);
        }
    }

    if (cargando) {
        return (
            <section className={styles.contenedor}>
                <h1>Mi inmobiliaria</h1>
                <EstadoCarga mensaje="Cargando inmobiliaria..." />
            </section>
        );
    }

    if (!inmobiliaria) {
        return (
            <section className={styles.contenedor}>
                <h1>Mi inmobiliaria</h1>
                <EstadoError mensaje={error ?? "No se encontró la inmobiliaria."} />
            </section>
        );
    }

    return (
        <section className={styles.contenedor}>
            <h1>Mi inmobiliaria</h1>
            <form
                className={styles.formulario}
                onSubmit={manejarSubmit}
                noValidate>
                <div className={styles.campo}>
                    <label htmlFor="nombre">
                        Nombre
                    </label>

                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(event) => setNombre(event.target.value)}
                        required />

                        {errores.nombre && (
                            <p className={styles.error}>
                                {errores.nombre}
                            </p>
                        )}
                </div>

                <div className={styles.campo}>
                    <label htmlFor="descripcion">
                        Descripción
                    </label>

                    <textarea
                        id="descripcion"
                        rows={5}
                        value={descripcion}
                        onChange={(event) => setDescripcion(event.target.value)}
                        required />

                        {errores.descripcion && (
                            <p className={styles.error}>
                                {errores.descripcion}
                            </p>
                        )}
                </div>

                <div className={styles.campo}>
                    <label htmlFor="logo">
                        URL del logo
                    </label>

                    <input
                        id="logo"
                        type="text"
                        placeholder="https://..."
                        value={logoUrl}
                        onChange={(event) => setLogoUrl(event.target.value)}
                    />
                </div>

                {logoUrl.trim() && (
                    <img
                        src={logoUrl}
                        alt={`Logo de ${nombre}`}
                        className={styles.logo} />
                )}

                <div className={styles.campo}>
                    <label htmlFor="telefono">
                        Teléfono de contacto
                    </label>

                    <input
                        id="telefono"
                        type="tel"
                        value={telefonoContacto}
                        onChange={(event) => setTelefonoContacto(event.target.value)}
                        pattern="[0-9]{4}-[0-9]{6}"
                        placeholder="2254-111111"
                        title="Ingresá el teléfono con el formato 2254-111111"
                        required />

                        {errores.telefonoContacto && (
                            <p className={styles.error}>
                                {errores.telefonoContacto}
                            </p>
                        )}
                </div>

                <div className={styles.campo}>
                    <label htmlFor="email">
                        Email de contacto
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={emailContacto}
                        onChange={(event) => setEmailContacto(event.target.value)}
                        required />

                        {errores.emailContacto && (
                            <p className={styles.error}>
                                {errores.emailContacto}
                            </p>
                        )}
                </div>

                <div className={styles.campo}>
                    <label htmlFor="direccion">
                        Dirección de la oficina
                    </label>

                    <input
                        id="direccion"
                        type="text"
                        value={direccionOficina}
                        onChange={(event) => setDireccionOficina(event.target.value)}
                    />
                </div>

                {error && (
                    <p className={styles.error}>
                        {error}
                    </p>
                )}
                {mensaje && (
                    <p className={styles.mensaje}>
                        {mensaje}
                    </p>
                )}

                <div className={styles.acciones}>
                    <button
                        type="submit"
                        className={styles.botonPrincipal}
                        disabled={guardando}>
                        {guardando
                            ? "Guardando..."
                            : "Guardar cambios"}
                    </button>
                </div>
            </form>

            <div className={styles.zonaPeligro}>
                <h2>Eliminar inmobiliaria</h2>
                <p>
                    Solo se puede eliminar si no tiene propiedades publicadas ni reservadas.
                </p>
                <button
                    type="button"
                    className={styles.botonEliminar}
                    onClick={() => setMostrarConfirmacion(true)}
                    disabled={eliminando}>
                    {eliminando
                        ? "Eliminando..."
                        : "Eliminar inmobiliaria"}
                </button>
            </div>

            <DialogoConfirmacion
                abierto={mostrarConfirmacion}
                titulo="Eliminar inmobiliaria"
                mensaje="¿Seguro que querés eliminar la inmobiliaria? Esta acción no se puede deshacer."
                textoConfirmar="Eliminar"
                cargando={eliminando}
                onConfirmar={confirmarEliminarInmobiliaria}
                onCancelar={() => setMostrarConfirmacion(false)}
            />
        </section>
    );

}