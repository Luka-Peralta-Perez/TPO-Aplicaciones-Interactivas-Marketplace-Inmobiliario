import { useEffect, useState } from "react";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { ComentarioPropiedad, PropiedadPanel } from "../../types";
import styles from "./Consultas.module.css";
import { useSearchParams } from "react-router-dom";
import { EstadoCarga, EstadoVacio, EstadoError } from "../../components/Estados/Estados";
import { TarjetaConsulta } from "../../components/TarjetaConsulta/TarjetaConsulta";

type GrupoConsultas = {
    propiedad: PropiedadPanel;
    comentarios: ComentarioPropiedad[];
};

export default function Consultas() {
    const [grupos, setGrupos] = useState<GrupoConsultas[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const comentarioOrigen = searchParams.get("comentario");

    useEffect(() => {
        async function cargarConsultas() {
            try {
                setCargando(true);
                setError(null);

                const propiedades = await propiedadesService.listarPropias();
                const gruposConComentarios = await Promise.all(propiedades.map(
                    async (propiedad) => {
                        const comentarios = await propiedadesService.listarComentarios(propiedad.id);
                        return { propiedad, comentarios };
                    }
                ));

                setGrupos(gruposConComentarios.filter(
                    (grupo) => grupo.comentarios.length > 0
                ));
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudieron cargar las consultas.");
                }
            } finally {
                setCargando(false);
            }
        }
        cargarConsultas();
    }, []);

    useEffect(() => {
        if (cargando || !comentarioOrigen) {
            return;
        }

        const elemento = document.getElementById(`comentario-${comentarioOrigen}`);

        elemento?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, [cargando, comentarioOrigen]);

    function actualizarRespuesta(comentarioId: number, respuesta: string) {
        setGrupos((anteriores) => anteriores.map((grupo) => ({
            ...grupo,
            comentarios: grupo.comentarios.map((comentario) =>
                comentario.id === comentarioId
                    ? { ...comentario, respuesta }
                    : comentario
            ),
        })));
    }

    if (cargando) {
        return (
            <section className={styles.contenedor}>
                <EstadoCarga mensaje="Cargando consultas..." />
            </section>
        );
    }

    return (
        <section className={styles.contenedor}>
            <h1 className={styles.titulo}>
                Consultas recibidas
            </h1>
            {error ? (
                <EstadoError mensaje={error} />
            ) : grupos.length === 0 ? (
                <EstadoVacio mensaje="No hay consultas recibidas." />
            ) : (
                grupos.map((grupo) => (
                    <section
                        key={grupo.propiedad.id}
                        className={styles.grupoPropiedad}>
                        <h2 className={styles.tituloPropiedad}>
                            {grupo.propiedad.titulo}
                        </h2>

                        {grupo.comentarios.map((comentario) => (
                            <TarjetaConsulta
                                key={comentario.id}
                                comentario={comentario}
                                onRespondida={actualizarRespuesta} />
                        ))}
                    </section>
                ))
            )}

        </section>
    );
}