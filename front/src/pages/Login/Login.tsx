import { type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useLogin } from "../../hooks/useLogin";

export default function Login() {
    const {
        email,
        setEmail,
        contrasenia,
        setContrasenia,
        mostrarContrasenia,
        setMostrarContrasenia,
        errores,
        enviando,
        errorGeneral,
        iniciar,
    } = useLogin();

    const navigate = useNavigate();
    const location = useLocation();

    const estado = location.state as
        | {
            desde?: string;
            registroExitoso?: boolean;
        }
        | null;

    const desde = estado?.desde ?? "/panel/propiedades";
    const registroExitoso = estado?.registroExitoso === true;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const inicioExitoso = await iniciar();

        if (inicioExitoso) {
            navigate(desde, {
                replace: true,
            });
        }
    }

    return (
        <section className={styles.contenedor}>
            <h1>Ingresar como vendedor</h1>

            {registroExitoso && (
                <p>
                    Cuenta creada correctamente. Ya podés iniciar sesión.
                </p>
            )}

            <form
                className={styles.formulario}
                onSubmit={handleSubmit}>
                <label htmlFor="email">
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email" />

                {errores.email && (
                    <p className={styles.error}>
                        {errores.email}
                    </p>
                )}

                <label htmlFor="contrasenia">
                    Contraseña
                </label>

                <div className={styles.campoContrasenia}>
                    <input
                        id="contrasenia"
                        type={mostrarContrasenia ? "text" : "password"}
                        value={contrasenia}
                        onChange={(event) => setContrasenia(event.target.value)}
                        autoComplete="current-password" />

                    <button
                        type="button"
                        onClick={() => setMostrarContrasenia((anterior) => !anterior)}>
                        {mostrarContrasenia ? "Ocultar" : "Mostrar"}
                    </button>
                </div>

                {errores.contrasenia && (
                    <p className={styles.error}>
                        {errores.contrasenia}
                    </p>
                )}

                {errorGeneral && (
                    <p className={styles.error}>
                        {errorGeneral}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={enviando}>
                    {enviando ? "Ingresando..." : "Ingresar"}
                </button>
            </form>

            <p>
                ¿No tenés cuenta?{" "}
                <Link to="/registro">
                    Registrate
                </Link>
            </p>
        </section>
    );
}