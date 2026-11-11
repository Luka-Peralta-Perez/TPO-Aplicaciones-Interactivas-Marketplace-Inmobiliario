import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function RequiereSesion() {
    const { estaAutenticado } = useAuth();
    const location = useLocation();

    if (!estaAutenticado) {
        // Guardamos la ruta para volver después del login
        const desde = location.pathname + location.search;

        return (
            <Navigate
                to="/login"
                replace
                state={{ desde }} />
        );
    }
    return <Outlet />;
}