import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { inmobiliariasService } from "../../services/inmobiliarias";
import type { InmobiliariaDatos } from "../../types";
import styles from "./InmobiliariaPanel.module.css";
import { EstadoCarga, EstadoError } from "../../components/Estados/Estados";
import { DialogoConfirmacion } from "../../components/DialogoConfirmacion/DialogoConfirmacion";
import { useFormularioInmobiliaria } from "../../hooks/useFormularioInmobiliaria";
import { FormularioInmobiliaria } from "../../components/FormularioInmobiliaria/FormularioInmobiliaria";

export default function InmobiliariaPanel() {
    const navigate = useNavigate();
    const formulario = useFormularioInmobiliaria();
    const { cargarDatos, validarFormulario, obtenerDatos, setErrores } = formulario;
    const [inmobiliaria, setInmobiliaria] = useState<InmobiliariaDatos | null>(null);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    useEffect(() => {
        async function cargarInmobiliaria() {
            try {
                setCargando(true);
                setError(null);

                const datos = await inmobiliariasService.obtenerPropia();
                setInmobiliaria(datos);
                cargarDatos(datos);
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudo cargar la inmobiliaria.");
                }
            } finally {
                setCargando(false);
            }
        }

        cargarInmobiliaria();
    }, [cargarDatos]);

    async function manejarSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrores({});
        setError(null);
        setMensaje(null);

        if (!validarFormulario() || !inmobiliaria) {
            return;
        }

        const datos = obtenerDatos();

        try {
            setGuardando(true);
            const actualizada = await inmobiliariasService.actualizar(inmobiliaria.id, datos);
            setInmobiliaria(actualizada);
            cargarDatos(actualizada);
            setMensaje("Los datos de la inmobiliaria se actualizaron correctamente!");
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("No se pudo actualizar la inmobiliaria");
            }
        } finally {
            setGuardando(false);
        }

    }

    async function confirmarEliminarInmobiliaria() {
        if (!inmobiliaria) {
            return;
        }
        setError(null);
        setMensaje(null);

        try {
            setEliminando(true);
            await inmobiliariasService.eliminar(inmobiliaria.id);
            navigate("/");
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("No se pudo eliminar la inmobiliaria.");
            }
        } finally {
            setEliminando(false);
            setMostrarConfirmacion(false);
        }
    }

    if (cargando) {
        return (
            <section className={styles.contenedor}>
                <h1>Mi inmobiliaria</h1>
                <EstadoCarga mensaje="Cargando inmobiliaria..." />
            </section>
        );
    }

    if (!inmobiliaria) {
        return (
            <section className={styles.contenedor}>
                <h1>Mi inmobiliaria</h1>
                <EstadoError mensaje={error ?? "No se encontró la inmobiliaria."} />
            </section>
        );
    }

    return (
        <section className={styles.contenedor}>
            <h1>Mi inmobiliaria</h1>
            <FormularioInmobiliaria
                formulario={formulario}
                onSubmit={manejarSubmit}
                guardando={guardando}
                error={error}
                mensaje={mensaje}
            />

            <div className={styles.zonaPeligro}>
                <h2>Eliminar inmobiliaria</h2>
                <p>
                    Solo se puede eliminar si no tiene propiedades publicadas ni reservadas.
                </p>
                <button
                    type="button"
                    className={styles.botonEliminar}
                    onClick={() => setMostrarConfirmacion(true)}
                    disabled={eliminando}>
                    {eliminando
                        ? "Eliminando..."
                        : "Eliminar inmobiliaria"}
                </button>
            </div>

            <DialogoConfirmacion
                abierto={mostrarConfirmacion}
                titulo="Eliminar inmobiliaria"
                mensaje="¿Seguro que querés eliminar la inmobiliaria? Esta acción no se puede deshacer."
                textoConfirmar="Eliminar"
                cargando={eliminando}
                onConfirmar={confirmarEliminarInmobiliaria}
                onCancelar={() => setMostrarConfirmacion(false)}
            />
        </section>
    );

}