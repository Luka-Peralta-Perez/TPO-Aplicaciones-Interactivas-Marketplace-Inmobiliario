import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../../comun/api";
import { propiedadesService } from "../../services/propiedades";
import type { PropiedadDetalle } from "../../types";
import styles from "../NuevaPropiedad/NuevaPropiedad.module.css";
import {EstadoCarga, EstadoError} from "../../components/Estados/Estados";
import { useFormularioPropiedad } from "../../hooks/useFormularioPropiedad";
import { FormularioPropiedad } from "../../components/FormularioPropiedad/FormularioPropiedad";

export default function EditarPropiedad() {
    const { id } = useParams();
    const navigate = useNavigate();
    const formulario = useFormularioPropiedad();
    const {
        validarFormulario,
        obtenerDatos,
        cargarDatos,
    } = formulario;
    const [propiedad, setPropiedad] = useState<PropiedadDetalle | null>(null);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function cargarPropiedad() {
            const propiedadId = Number(id);

            if (!propiedadId) {
                setError("Propiedad inválida.");
                setCargando(false);
                return;
            }

            try {
                const datos = await propiedadesService.obtener(propiedadId);

                setPropiedad(datos);

                cargarDatos({
                    titulo: datos.titulo,
                    descripcion: datos.descripcion,
                    tipo: datos.tipo,
                    operacion: datos.operacion,
                    precio: datos.precio,
                    moneda: datos.moneda,
                    direccion: datos.direccion,
                    zona: datos.zona,
                    superficieCubiertaM2:
                        datos.superficieCubiertaM2 ?? "",
                    superficieTotalM2:
                        datos.superficieTotalM2,
                    ambientes:
                        datos.ambientes?.toString() ?? "",
                    dormitorios:
                        datos.dormitorios?.toString() ?? "",
                    banios:
                        datos.banios?.toString() ?? "",
                    antiguedadAnios:
                        datos.antiguedadAnios?.toString() ?? "",
                    amenities: datos.amenities,
                    fotos: datos.fotos,
                    fotoPortada: datos.fotoPortada,
                });
            } catch (error) {
                if (error instanceof ApiError) {
                    setError(error.message);
                } else {
                    setError("No se pudo cargar la propiedad");
                }
            } finally {
                setCargando(false);
            }
        }

        cargarPropiedad();
    }, [id, cargarDatos]);

    async function manejarSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);

        if (!propiedad) {
            return;
        }

        if (!validarFormulario()) {
            return;
        }

        const datos = obtenerDatos();

        try {
            setGuardando(true);

            await propiedadesService.actualizar(propiedad.id, datos);

            navigate("/panel/propiedades");
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("No se pudo actualizar la propiedad");
            }
        } finally {
            setGuardando(false);
        }
    }

    if (cargando) {
        return (
            <EstadoCarga mensaje="Cargando propiedad..." />
        );
    }

    if (!propiedad) {
        return (
            <section className={styles.contenedor}>
                <EstadoError
                    mensaje={error ?? "No se encontró la propiedad."}/>

                <button
                    type="button"
                    className={styles.botonSecundario}
                    onClick={() => navigate("/panel/propiedades")}>
                    Volver
                </button>
            </section>
        );
    }

    if (
        propiedad.estado === "VENDIDA" ||
        propiedad.estado === "ALQUILADA" ||
        propiedad.estado === "CANCELADA"
    ) {
        return (
            <section className={styles.contenedor}>
                <h1>Editar propiedad</h1>

                <p>
                    Esta propiedad no puede editarse porque su estado actual es{" "}
                    <strong>{propiedad.estado}</strong>
                </p>

                <button
                    type="button"
                    className={styles.botonSecundario}
                    onClick={() => navigate("/panel/propiedades")}>
                    Volver
                </button>
            </section>
        );
    }

    return (
        <section className={styles.contenedor}>
            <div className={styles.encabezado}>
                <div>
                    <h1>Editar propiedad</h1>
                    <p>Modificá los datos actuales de la propiedad.</p>
                </div>

                <button
                    type="button"
                    className={styles.botonSecundario}
                    onClick={() => navigate("/panel/propiedades")}>
                    Volver
                </button>
            </div>

            <FormularioPropiedad
                formulario={formulario}
                onSubmit={manejarSubmit}
                onCancelar={() => navigate("/panel/propiedades")}
                guardando={guardando}
                error={error}
                textoBoton="Guardar cambios"
                textoFotos="Podés modificar, agregar, eliminar y ordenar las fotos."/>
        </section>
    );
}