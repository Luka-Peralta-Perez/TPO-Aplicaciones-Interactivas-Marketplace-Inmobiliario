import { useEffect, useState } from "react";
import { ApiError } from "../../comun/api";
import { inmobiliariasService } from "../../services/inmobiliarias";
import { reportesService } from "../../services/reportes";
import type { ReporteMensual, ReportePropiedadesPorEstado, ReporteTiempoMercado } from "../../types";
import styles from "./Reportes.module.css";
import { EstadoCarga, EstadoError, EstadoVacio } from "../../components/Estados/Estados";

export default function Reportes() {
    const [estados, setEstados] = useState<ReportePropiedadesPorEstado | null>(null);
    const [mensual, setMensual] = useState<ReporteMensual[]>([]);
    const [tiempoMercado, setTiempoMercado] = useState<ReporteTiempoMercado | null>(null);
    const [cargandoEstados, setCargandoEstados] = useState(true);
    const [cargandoMensual, setCargandoMensual] = useState(true);
    const [cargandoTiempo, setCargandoTiempo] = useState(true);
    const [errorEstados, setErrorEstados] = useState<string | null>(null);
    const [errorMensual, setErrorMensual] = useState<string | null>(null);
    const [errorTiempo, setErrorTiempo] = useState<string | null>(null);

    useEffect(() => {
        async function cargarReportes() {
            try {
                const inmobiliaria = await inmobiliariasService.obtenerPropia();

                async function cargarEstados() {
                    try {
                        const datos = await reportesService.obtenerEstados(inmobiliaria.id);
                        setEstados(datos);
                    } catch (error) {
                        if (error instanceof ApiError) {
                            setErrorEstados(error.message);
                        } else {
                            setErrorEstados("No se pudo cargar el reporte por estado.");
                        }
                    } finally {
                        setCargandoEstados(false);
                    }
                }

                async function cargarMensual() {
                    try {
                        const datos = await reportesService.obtenerMensual(inmobiliaria.id);
                        setMensual(datos);
                    } catch (error) {
                        if (error instanceof ApiError) {
                            setErrorMensual(error.message);
                        } else {
                            setErrorMensual("No se pudo cargar la evolución mensual.");
                        }
                    } finally {
                        setCargandoMensual(false);
                    }
                }

                async function cargarTiempo() {
                    try {
                        const datos = await reportesService.obtenerTiempoPromedio(inmobiliaria.id);
                        setTiempoMercado(datos);
                    } catch (error) {
                        if (error instanceof ApiError) {
                            setErrorTiempo(error.message);
                        } else {
                            setErrorTiempo("No se pudo cargar el tiempo promedio en mercado.");
                        }
                    } finally {
                        setCargandoTiempo(false);
                    }
                }

                await Promise.all([cargarEstados(), cargarMensual(), cargarTiempo()]);
            } catch (error) {
                const mensaje = error instanceof ApiError
                ? error.message
                : "No se pudo obtener la inmobiliaria";

                setErrorEstados(mensaje);
                setErrorMensual(mensaje);
                setErrorTiempo(mensaje);

                setCargandoEstados(false);
                setCargandoMensual(false);
                setCargandoTiempo(false);
            }
        }
        cargarReportes();
    }, []);

    function formatearEstado(estado: string) {
        return estado
        .toLowerCase()
        .replace("_", " ")
        .replace(/^\w/, (letra) =>
        letra.toUpperCase()
    );
    }

    function formatearMes(mes: string) {
        const [anio, numeroMes] = mes.split("-");
        const fecha = new Date(
            Number(anio),
            Number(numeroMes) - 1
        );
        return fecha.toLocaleDateString("es-AR", {
            month: "short",
            year: "numeric",
        });
    }
    const maximoMensual = Math.max(1, 
        ...mensual.flatMap((item) => [
            item.publicacionesNuevas,
            item.ventas,
            item.alquileres,
        ])
    );

    function alturaBarra(valor: number) {
        if (valor === 0) {
            return "0px";
        }

        const altura = (valor / maximoMensual) * 160;

        return `${Math.max(altura, 8)}px`;
    }

    return (
        <section className={styles.contenedor}>
            <h1 className={styles.titulo}>
                Reportes
            </h1>
            <section className={styles.seccion}>
                <h2>Propiedades por estado</h2>
                {cargandoEstados ? (
                    <EstadoCarga mensaje="Cargando estados..."/>
                    ): errorEstados ? (
                        <EstadoError mensaje={errorEstados}/>
                    ) : estados ? (
                        <div className={styles.tarjetas}>
                            {Object.entries(estados).map(
                                ([estado, cantidad]) => (
                                    <article
                                    key={estado}
                                    className={styles.tarjeta}>
                                        <span className={styles.nombreEstado}>
                                            {formatearEstado(estado)}
                                        </span>
                                        <strong className={styles.cantidad}>
                                            {cantidad}
                                        </strong>
                                    </article>
                                )
                            )}
                        </div>
                    ): (
                        <EstadoVacio mensaje="No hay datos de propiedades por estado"/>
                    )}
            </section>

            <section className={styles.seccion}>
                <h2>Publicaciones y operaciones por mes</h2>
                {cargandoMensual ? (
                    <EstadoCarga mensaje="Cargando evolución mensual..."/>
                    ): errorMensual ? (
                        <EstadoError mensaje={errorMensual}/>
                    ): mensual.length === 0 ? (
                        <EstadoVacio mensaje="Todavía no hay datos mensuales."/>
                    ) : ( 
                        <>
                        <div className={styles.leyenda}>
                            <span>Publicaciones nuevas</span>
                            <span>Ventas</span>
                            <span>Alquileres</span>
                        </div>

                        <div className={styles.grafico}>
                            {mensual.map((item) => (
                                <div 
                                key={item.mes}
                                className={styles.grupoMes}>
                                    <div className={styles.barras}>
                                        <div className={`${styles.barra} ${styles.publicaciones}`}
                                        style={{
                                            height: alturaBarra(item.publicacionesNuevas),
                                        }}
                                        title={`Publicaciones: ${item.publicacionesNuevas}`}>
                                            {item.publicacionesNuevas > 0 && item.publicacionesNuevas}
                                        </div>

                                        <div className={`${styles.barra} ${styles.ventas}`}
                                        style={{
                                            height: alturaBarra(item.ventas),
                                        }}
                                        title={`Ventas: ${item.ventas}`}>
                                            {item.ventas > 0 && item.ventas}
                                        </div>

                                        <div className={`${styles.barra} ${styles.alquileres}`}
                                        style={{
                                            height: alturaBarra(item.alquileres),
                                        }}
                                        title={`Alquileres: ${item.alquileres}`}>
                                            {item.alquileres > 0 && item.alquileres}
                                        </div>
                                    </div>
                                    <span className={styles.mes}>
                                        {formatearMes(item.mes)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        </>
                    )}
            </section>

            <section className={styles.seccion}>
                <h2>Tiempo promedio en mercado</h2>
                {cargandoTiempo ? (
                    <EstadoCarga mensaje="Cargando tiempo promedio..."/>
                ): errorTiempo ? (
                    <EstadoError mensaje={errorTiempo}/>
                ) : tiempoMercado && tiempoMercado.propiedadesConsideradas > 0 ? (
                    <div className={styles.tiempoPromedio}>
                        <strong>{tiempoMercado.promedioDias}</strong>
                        <span>días</span>
                        <p>
                            Calculado sobre{" "}
                            {tiempoMercado.propiedadesConsideradas}{" "}
                            propiedad
                            {tiempoMercado.propiedadesConsideradas !== 1
                            ? "es"
                            : ""
                        }
                        </p>
                    </div>
                ) : (
                    <EstadoVacio mensaje="Todavía no hay propiedades vendidas o alquiladas para calcular este indicador"/>
                )}
            </section>
        </section>
    );
}