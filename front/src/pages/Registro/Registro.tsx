import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Registro.module.css";
import { useRegistro } from "../../hooks/useRegistro";

export default function Registro() {
    const navigate = useNavigate();

    const {
        nombre, setNombre,
        apellido, setApellido,
        email, setEmail,
        contrasenia, setContrasenia,
        confirmarContrasenia, setConfirmarContrasenia,
        telefono, setTelefono,
        nombreInmobiliaria, setNombreInmobiliaria,
        errores,
        errorGeneral,
        enviando,
        registrar,
    } = useRegistro();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const registroExitoso = await registrar();

        if (registroExitoso) {
            navigate("/login", {
                replace: true,
                state: { registroExitoso: true },
            });
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