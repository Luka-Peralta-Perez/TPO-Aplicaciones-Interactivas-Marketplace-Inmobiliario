import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import styles from "./LayoutPanel.module.css";

export default function LayoutPanel() {
    const { cerrarSesion } = useAuth();
    const navigate = useNavigate();

    function salir() {
        cerrarSesion();
        navigate("/", { replace: true });
    }

    function claseEnlace({
        isActive,
    }: {
        isActive: boolean;
    }) {
        return isActive
            ? styles.activo
            : styles.enlace;
    }

    return (
        <>
            <header className={styles.header}>
                <strong>Panel del vendedor</strong>

                <nav className={styles.nav}>
                    <NavLink
                        to="/panel/propiedades"
                        className={claseEnlace}>
                        Mis propiedades
                    </NavLink>

                    <NavLink
                        to="/panel/visitas"
                        className={claseEnlace}
                    >
                        Visitas
                    </NavLink>

                    <NavLink
                        to="/panel/consultas"
                        className={claseEnlace}
                    >
                        Consultas
                    </NavLink>

                    <NavLink
                        to="/panel/actividad"
                        className={claseEnlace}
                    >
                        Actividad
                    </NavLink>

                    <NavLink
                        to="/panel/reportes"
                        className={claseEnlace}
                    >
                        Reportes
                    </NavLink>

                    <button
                        type="button"
                        onClick={salir}
                    >
                        Salir
                    </button>

                </nav>
            </header>

            <main className={styles.contenido}>
                <Outlet />
            </main>
        </>
    );
}

