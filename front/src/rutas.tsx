import { Navigate, type RouteObject } from "react-router-dom";
import LayoutPublico from "./components/LayoutPublico/LayoutPublico";
import LayoutPanel from "./components/LayoutPanel/LayoutPanel";
import RequiereSesion from "./components/RequiereSesion/RequiereSesion";
import NoEncontrada from "./pages/NoEncontrada";
import { ActividadPanel, ConsultasPanel, DetallePropiedad, EditarPropiedad, InmobiliariaPanel, Inicio, NuevaPropiedad, PropiedadesPanel, Registro, ReportesPanel, SitioInmobiliario, VisitasPanel } from "./pages/PaginasTemporales";
import Login from "./pages/Login/Login";

export const rutas: RouteObject[] = [
    {
        path: "/",
        element: <LayoutPublico />,
        children: [
            {
                index: true,
                element: <Inicio />,
            },
            {
                path: "propiedades/:id",
                element: <DetallePropiedad />
            },
            {
                path: "inmobiliarias/:id",
                element: <SitioInmobiliario />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "registro",
                element: <Registro />,
            },
        ],
    },
    {
        element: <RequiereSesion />,
        children: [
            {
                path: "/panel",
                element: <LayoutPanel />,
                children: [
                    {
                        index: true,
                        element: (
                            <Navigate
                                to="/panel/propiedades"
                                replace
                            />
                        ),
                    },
                    {
                        path: "propiedades",
                        element: <PropiedadesPanel />,
                    },
                    {
                        path: "propiedades/nueva",
                        element: <NuevaPropiedad />,
                    },
                    {
                        path: "propiedades/:id/editar",
                        element: <EditarPropiedad />,
                    },
                    {
                        path: "inmobiliaria",
                        element: <InmobiliariaPanel />,
                    },
                    {
                        path: "visitas",
                        element: <VisitasPanel />,
                    },
                    {
                        path: "consultas",
                        element: <ConsultasPanel />,
                    },
                    {
                        path: "actividad",
                        element: <ActividadPanel />,
                    },
                    {
                        path: "reportes",
                        element: <ReportesPanel />
                    },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <NoEncontrada />
    },
];