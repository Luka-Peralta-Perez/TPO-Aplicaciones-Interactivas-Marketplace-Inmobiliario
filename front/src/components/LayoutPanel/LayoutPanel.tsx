import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { actividadesService } from "../../services/actividades";
import { inmobiliariasService } from "../../services/inmobiliarias";
import styles from "./LayoutPanel.module.css";

export default function LayoutPanel() {
    const { cerrarSesion } = useAuth();
    const navigate = useNavigate();
    const [noLeidas, setNoLeidas] = useState(0);

    useEffect(() => {
        let activo = true;

        async function actualizarContador() {
            try {
                const inmobiliaria = await inmobiliariasService.obtenerPropia();
                const respuesta = await actividadesService.contarNoLeidas(inmobiliaria.id);

                if (activo) {
                    setNoLeidas(respuesta.unreadCount);
                }
            } catch {

            }
        }
        actualizarContador();

        const intervalo = window.setInterval(actualizarContador, 10000);

        return () => {
            activo = false;
            window.clearInterval(intervalo);
        };
    }, []);

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
                <div className={styles.tituloPanel}>
                    <strong>Panel del vendedor</strong>
                    <NavLink
                        to="/panel/inmobiliaria"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.enlaceInmobiliaria} ${styles.inmobiliariaActiva}`
                                : styles.enlaceInmobiliaria
                        }>
                        Mi inmobiliaria
                    </NavLink>
                </div>

                <nav className={styles.nav}>

                    <NavLink
                        to="/panel/propiedades"
                        className={claseEnlace}
                    >
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
                        Actividad 🔔
                        {noLeidas > 0 && (
                            <span className={styles.contador}>
                                {noLeidas}
                            </span>
                        )}
                    </NavLink>

                    <NavLink
                        to="/panel/reportes"
                        className={claseEnlace}
                    >
                        Reportes
                    </NavLink>

                    <button
                        type="button"
                        className={styles.botonSalir}
                        onClick={salir}>
                        Salir
                    </button>

                </nav>
            </header>

            <main className={styles.contenido}>
                <Outlet
                    context={{
                        disminuirNoLeidas: () =>
                            setNoLeidas((actual) =>
                                Math.max(0, actual - 1)
                            ),
                    }}
                />
            </main>
        </>
    );
}

