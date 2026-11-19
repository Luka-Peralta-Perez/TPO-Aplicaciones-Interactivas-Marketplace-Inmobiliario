import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ApiError } from "../comun/api";
import { inmobiliariasService } from "../services/inmobiliarias";
import { visitasService } from "../services/visitas";
import type { EstadoSolicitudVisita, SolicitudVisita } from "../types";

type ConfirmacionVisita = {
    solicitudId: number;
    nuevoEstado: EstadoSolicitudVisita;
    titulo: string;
    mensaje: string;
    textoConfirmar: string;
};

export function useSolicitudesVisita() {
    const [solicitudes, setSolicitudes] = useState<SolicitudVisita[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actualizadoId, setActualizadoId] = useState<number | null>(null);
    const [filtro, setFiltro] = useState<"PENDIENTES" | "TODAS">("PENDIENTES");
    const [errorAccion, setErrorAccion] = useState<string | null>(null);
    const [confirmacion, setConfirmacion] = useState<ConfirmacionVisita | null>(null);
    const [searchParams] = useSearchParams();
    const visitaOrigen = searchParams.get("visita");

    useEffect(() => {
        async function cargarSolicitudes() {
            try {
                setCargando(true);
                setError(null);

                const inmobiliaria = await inmobiliariasService.obtenerPropia();
                const datos = await visitasService.listar(inmobiliaria.id);
                setSolicitudes(datos);
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudieron cargar las solicitudes de visita.");
                }
            } finally {
                setCargando(false);
            }
        }

        cargarSolicitudes();
    }, []);

    useEffect(() => {
        if (visitaOrigen) {
            setFiltro("TODAS");
        }
    }, [visitaOrigen]);

    useEffect(() => {
        if (cargando || !visitaOrigen || filtro !== "TODAS") {
            return;
        }

        const elemento = document.getElementById(`visita-${visitaOrigen}`);

        elemento?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, [cargando, visitaOrigen, filtro]);

    async function ejecutarCambiarEstado(solicitudId: number, nuevoEstado: EstadoSolicitudVisita) {
        try {
            setActualizadoId(solicitudId);
            setErrorAccion(null);

            await visitasService.cambiarEstado(solicitudId, nuevoEstado);

            setSolicitudes((anteriores) => anteriores.map((solicitud) =>
                solicitud.id === solicitudId
                    ? { ...solicitud, estado: nuevoEstado }
                    : solicitud
            ));
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorAccion(error.message);
            } else {
                setErrorAccion("No se pudo actualizar la solicitud.");
            }
        } finally {
            setActualizadoId(null);
        }
    }

    function cambiarEstado(solicitudId: number, nuevoEstado: EstadoSolicitudVisita) {
        if (nuevoEstado === "RECHAZADA") {
            setConfirmacion({
                solicitudId,
                nuevoEstado,
                titulo: "Rechazar solicitud",
                mensaje: "¿Seguro que querés rechazar esta solicitud de visita?",
                textoConfirmar: "Rechazar",
            });
            return;
        }

        if (nuevoEstado === "CANCELADA") {
            setConfirmacion({
                solicitudId,
                nuevoEstado,
                titulo: "Cancelar visita",
                mensaje: "¿Seguro que querés cancelar esta visita?",
                textoConfirmar: "Cancelar visita",
            });
            return;
        }

        void ejecutarCambiarEstado(solicitudId, nuevoEstado);
    }

    async function confirmarCambioEstado() {
        if (!confirmacion) {
            return;
        }

        const { solicitudId, nuevoEstado } = confirmacion;
        await ejecutarCambiarEstado(solicitudId, nuevoEstado);
        setConfirmacion(null);
    }

    const solicitudesFiltradas = filtro === "PENDIENTES"
        ? solicitudes.filter((solicitud) => solicitud.estado === "PENDIENTE")
        : solicitudes;

    const solicitudesPorPropiedad = solicitudesFiltradas.reduce((grupos, solicitud) => {
        const propiedadId = solicitud.propiedad.id;

        if (!grupos[propiedadId]) {
            grupos[propiedadId] = {
                titulo: solicitud.propiedad.titulo,
                solicitudes: [],
            };
        }

        grupos[propiedadId].solicitudes.push(solicitud);
        return grupos;
    }, {} as Record<number, {
        titulo: string;
        solicitudes: SolicitudVisita[];
    }>);

    return {
        cargando,
        error,
        errorAccion,
        filtro,
        setFiltro,
        actualizadoId,
        confirmacion,
        setConfirmacion,
        cambiarEstado,
        confirmarCambioEstado,
        solicitudesFiltradas,
        solicitudesPorPropiedad,
    };
}