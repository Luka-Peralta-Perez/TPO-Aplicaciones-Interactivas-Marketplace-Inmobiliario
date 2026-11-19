import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { actividadesService } from "../../services/actividades";
import { inmobiliariasService } from "../../services/inmobiliarias";
import type { Actividad as ActividadType } from "../../types";
import styles from "./Actividad.module.css";
import { EstadoCarga, EstadoVacio, EstadoError } from "../../components/Estados/Estados";

export default function Actividad() {
    const [actividades, setActividades] = useState<ActividadType[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [marcandoId, setMarcandoId] = useState<number | null>(null);
    const navigate = useNavigate();
    const { disminuirNoLeidas } = useOutletContext<{
        disminuirNoLeidas: () => void;
    }>();
    const [inmobiliariaId, setInmobiliariaId] = useState<number | null>(null);

    useEffect(() => {
        async function cargarActividad() {
            try {
                setCargando(true);
                setError(null);

                const inmobiliaria = await inmobiliariasService.obtenerPropia();
                setInmobiliariaId(inmobiliaria.id);
                const datos = await actividadesService.listar(inmobiliaria.id);
                const ordenadas = [...datos].sort((a, b) =>
                    new Date(b.creadoEn).getTime() -
                    new Date(a.creadoEn).getTime()
                );
                setActividades(ordenadas);
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudo cargar la actividad.");
                }
            } finally {
                setCargando(false);
            }
        }
        cargarActividad();
    }, []);

    function obtenerDestino(actividad: ActividadType) {
        switch (actividad.tipo) {
            case "COMENTARIO":
                return `/panel/consultas?comentario=${actividad.referenciaOrigen}`;

            case "SOLICITUD_VISITA":
                return `/panel/visitas?visita=${actividad.referenciaOrigen}`;

            case "CAMBIO_ESTADO_PROPIEDAD":
                return `/panel/propiedades?propiedad=${actividad.referenciaOrigen}`;

            case "RESENA":
                return inmobiliariaId
                    ? `/inmobiliarias/${inmobiliariaId}?resenia=${actividad.referenciaOrigen}&desde=panel`
                    : "/panel/inmobiliaria";

            default:
                return "/panel/actividad";
        }
    }

    function obtenerTexto(actividad: ActividadType) {
        switch (actividad.tipo) {
            case "COMENTARIO":
                return "Nueva consulta recibida";

            case "SOLICITUD_VISITA":
                return "Nueva solicitud de visita";

            case "CAMBIO_ESTADO_PROPIEDAD":
                return "Cambio de estado de una propiedad";

            case "RESENA":
                return "Nueva reseña recibida";

            default:
                return "Nueva actividad";
        }
    }

    async function abrirActividad(actividad: ActividadType) {
        try {
            if (!actividad.leida) {
                setMarcandoId(actividad.id);

                await actividadesService.marcarComoLeida(actividad.id);

                disminuirNoLeidas();

                setActividades((anteriores) =>
                    anteriores.map((item) =>
                        item.id === actividad.id
                            ? { ...item, leida: true }
                            : item
                    ));
            }
            navigate(obtenerDestino(actividad));
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("No se pudo marcar la actividad como leída.");
            }
        } finally {
            setMarcandoId(null);
        }
    }

    if (cargando) {
        return (
            <section className={styles.contenedor}>
                <EstadoCarga mensaje="Cargando actividad..." />
            </section>
        );
    }

    return (
        <section className={styles.contenedor}>
            <h1 className={styles.titulo}>
                Actividad
            </h1>
            {error && (
                <EstadoError mensaje={error} />
            )}
            {actividades.length === 0 ? (
                <EstadoVacio mensaje="No hay actividad registrada." />
            ) : (
                <div className={styles.lista}>
                    {actividades.map((actividad) => (
                        <button
                            key={actividad.id}
                            type="button"
                            disabled={marcandoId === actividad.id}
                            onClick={() => abrirActividad(actividad)}
                            className={`${styles.actividad} ${actividad.leida
                                    ? styles.leida
                                    : styles.noLeida
                                }`}>
                            <div className={styles.encabezado}>
                                <strong>
                                    {actividad.leida ? "○" : "●"}{" "}
                                    {obtenerTexto(actividad)}
                                </strong>
                                <span className={styles.estado}>
                                    {actividad.leida ? "Leída" : "Sin leer"}
                                </span>
                            </div>

                            <p className={styles.fecha}>
                                {new Date(actividad.creadoEn).toLocaleString("es-AR")}
                            </p>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );

}