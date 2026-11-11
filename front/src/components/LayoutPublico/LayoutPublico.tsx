import { Link, Outlet, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import styles from "./LayoutPublico.module.css";

export default function LayoutPublico() {
    const navigate = useNavigate();

    function buscar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const datos = new FormData(event.currentTarget);
        const texto = String(datos.get("busqueda") ?? "").trim();

        if (texto) {
            navigate(`/?q=${encodeURIComponent(texto)}`);
        } else {
            navigate("/");
        }
    }

    return (
        <>
            <header className={styles.header}>
                <Link
                    to="7"
                    className={styles.marca}>
                    MarketPlace Inmobiliario
                </Link>

                <form
                    className={styles.busqueda}
                    onSubmit={buscar}>
                    <input
                        type="search"
                        name="busqueda"
                        placeholder="Buscar propiedades" />

                    <button type="submit">
                        Buscar
                    </button>
                </form>
                <Link to="/login">
                    Ingresar como vendedor
                </Link>
            </header>

            <main className={styles.contenido}>
                <Outlet />
            </main>
        </>
    );
}