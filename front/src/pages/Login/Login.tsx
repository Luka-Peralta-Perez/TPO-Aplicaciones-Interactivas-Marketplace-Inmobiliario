import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { ApiError } from "../../comun/api";
import { authService } from "../../services/auth";
import styles from "./Login.module.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    const { iniciarSesion } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // SI viene de una ruta protegida, se vuelve ahí después del login
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
        setError(null);

        if (!email.trim() || !contrasenia) {
            setError("Ingresá tu email y contraseña.");
            return;
        }
        setEnviando(true);

        try {
            const sesion = await authService.login({
                email: email.trim(),
                contrasenia,
            });

            iniciarSesion(sesion);

            navigate(desde, {
                replace: true,
            });
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);

                if (error.status === 401) {
                    setContrasenia("");
                }
                return;
            }
            setError("No se pudo iniciar sesión.");
        } finally {
            setEnviando(false);
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
                onSubmit={handleSubmit}
            >
                <label htmlFor="email">
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    autoComplete="email"
                />

                <label htmlFor="contrasenia">
                    Contraseña
                </label>
                <div
                    className={styles.campoContrasenia}
                >
                    <input
                        id="contrasenia"
                        type={
                            mostrarContrasenia
                                ? "text"
                                : "password"
                        }
                        value={contrasenia}
                        onChange={(event) =>
                            setContrasenia(event.target.value)
                        }
                        autoComplete="current-password"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setMostrarContrasenia((anterior) => !anterior)
                        }
                    >
                        {mostrarContrasenia
                            ? "Ocultar"
                            : "Mostrar"}
                    </button>
                </div>

                {error && (
                    <p className={styles.error}>
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={enviando}
                >
                    {enviando
                        ? "Ingresando..."
                        : "Ingresar"}
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