import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { authService } from "../../services/auth";
import type { RegistrarDto } from "../../types";
import styles from "./Registro.module.css";

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

export default function Registro() {
    const navigate = useNavigate();

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

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorGeneral("");

        if (!validarFormulario()) {
            return;
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
            navigate("/login", {
                replace: true,
                state: { registroExitoso: true },
            });
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 409) {
                    const details = error.details as
                        | { field?: string }
                        | undefined;

                    if (details?.field === "email") {
                        setErrores((anteriores) => ({
                            ...anteriores,
                            email: error.message,
                        }));
                        return;
                    }

                    if (details?.field === "nombreInmobiliaria") {
                        setErrores((anteriores) => ({
                            ...anteriores,
                            nombreInmobiliaria: error.message,
                        }));
                        return;
                    }
                }

                setErrorGeneral(error.message);
            } else {
                setErrorGeneral("No se pudo completar el registro");
            }
        } finally {
            setEnviando(false);
        }
    }

    return (
        <main className={styles.contenedor}>
            <section className={styles.tarjeta}>
                <h1>Crear cuenta</h1>
                <p className={styles.descripcion}>
                    Registrate para administrar tu inmobiliaria y sus propiedades.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.fila}>
                        <div className={styles.campo}>
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(event) => setNombre(event.target.value)}
                                disabled={enviando} />
                            {errores.nombre && (
                                <p className={styles.errorCampo}>{errores.nombre}</p>
                            )}
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="apellido">Apellido</label>
                            <input
                                id="apellido"
                                type="text"
                                value={apellido}
                                onChange={(event) => setApellido(event.target.value)}
                                disabled={enviando} />
                            {errores.apellido && (
                                <p className={styles.errorCampo}>{errores.apellido}</p>
                            )}
                        </div>
                    </div>

                    <div className={styles.campo}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            disabled={enviando} />
                        {errores.email && (
                            <p className={styles.errorCampo}>{errores.email}</p>
                        )}
                    </div>

                    <div className={styles.campo}>
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                            id="telefono"
                            type="tel"
                            value={telefono}
                            onChange={(event) => setTelefono(event.target.value)}
                            disabled={enviando} />
                        {errores.telefono && (
                            <p className={styles.errorCampo}>{errores.telefono}</p>
                        )}
                    </div>

                    <div className={styles.campo}>
                        <label htmlFor="nombreInmobiliaria">Nombre de la inmobiliaria</label>
                        <input
                            id="nombreInmobiliaria"
                            type="text"
                            value={nombreInmobiliaria}
                            onChange={(event) => setNombreInmobiliaria(event.target.value)}
                            disabled={enviando} />
                        {errores.nombreInmobiliaria && (
                            <p className={styles.errorCampo}>{errores.nombreInmobiliaria}</p>
                        )}
                    </div>

                    <div className={styles.campo}>
                        <label htmlFor="contrasenia">Contraseña</label>
                        <input
                            id="contrasenia"
                            type="password"
                            value={contrasenia}
                            onChange={(event) => setContrasenia(event.target.value)}
                            disabled={enviando} />
                        {errores.contrasenia && (
                            <p className={styles.errorCampo}>{errores.contrasenia}</p>
                        )}
                    </div>

                    <div className={styles.campo}>
                        <label htmlFor="confirmarContrasenia">Confirmar contraseña</label>
                        <input
                            id="confirmarContrasenia"
                            type="password"
                            value={confirmarContrasenia}
                            onChange={(event) => setConfirmarContrasenia(event.target.value)}
                            disabled={enviando} />
                        {errores.confirmarContrasenia && (
                            <p className={styles.errorCampo}>{errores.confirmarContrasenia}</p>
                        )}
                    </div>

                    {errorGeneral && (
                        <p className={styles.errorGeneral}>{errorGeneral}</p>
                    )}

                    <button
                        className={styles.boton}
                        type="submit"
                        disabled={enviando}>
                        {enviando ? "Creando cuenta..." : "Crear cuenta"}
                    </button>
                </form>

                <p className={styles.login}>
                    ¿Ya tenés una cuenta? <Link to="/login">Iniciar sesión</Link>
                </p>
            </section>
        </main>
    );
}