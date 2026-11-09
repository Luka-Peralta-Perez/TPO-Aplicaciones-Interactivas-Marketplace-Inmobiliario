import { EstadoPropiedad } from "../entities/enums";
import { ForbiddenError } from "../errors/auth.errors";
import { NotFoundError } from "../errors/propiedades.errors";
import { inmobiliariasRepository } from "../repositories/inmobiliarias.repository";
import { reportesRepository } from "../repositories/reportes.repository";

async function verificarAcceso(inmobiliariaId: number, vendedorId: number): Promise<void> {
    const inmobiliaria = await inmobiliariasRepository.buscarPorId(inmobiliariaId);

    if (!inmobiliaria) {
        throw new NotFoundError(`Inmobiliaria ${inmobiliariaId} no encontrada`);
    }

    const esPropietario = await inmobiliariasRepository.perteneceAVendedor(inmobiliariaId, vendedorId);

    if (!esPropietario) {
        throw new ForbiddenError("No tenés permiso para ver los reportes de esta inmobiliaria");
    }
}

export const reportesService = {
    async resumenPorEstado(inmobiliariaId: number, vendedorId: number) {
        await verificarAcceso(inmobiliariaId, vendedorId);

        const cantidades = await reportesRepository.contarPropiedadesPorEstado(inmobiliariaId);
        const resumen: Record<EstadoPropiedad, number> = {
            [EstadoPropiedad.BORRADOR]: 0,
            [EstadoPropiedad.PUBLICADA]: 0,
            [EstadoPropiedad.RESERVADA]: 0,
            [EstadoPropiedad.PAUSADA]: 0,
            [EstadoPropiedad.VENDIDA]: 0,
            [EstadoPropiedad.ALQUILADA]: 0,
            [EstadoPropiedad.CANCELADA]: 0,
        };

        for (const item of cantidades) {
            resumen[item.estado] = item.cantidad;
        }

        return resumen;
    },

    async resumenMensual(inmobiliariaId: number, vendedorId: number) {
        await verificarAcceso(inmobiliariaId, vendedorId);
        const historial = await reportesRepository.listarHistorialParaReportes(inmobiliariaId);
        const publicacionesRegistradas = new Set<number>();
        const meses = new Map<string, {
            mes: string,
            publicacionesNuevas: number,
            ventas: number,
            alquileres: number;
        }
        >();

        function obtenerMes(mes: string) {
            if (!meses.has(mes)) {
                meses.set(mes, {
                    mes,
                    publicacionesNuevas: 0,
                    ventas: 0,
                    alquileres: 0,
                });
            }
            return meses.get(mes)!;
        }

        for (const cambio of historial) {
            const mes = cambio.creadoEn
                .toISOString()
                .slice(0, 7);

            if (cambio.estadoNuevo === EstadoPropiedad.PUBLICADA &&
                !publicacionesRegistradas.has(cambio.propiedad.id)
            ) {
                obtenerMes(mes).publicacionesNuevas++;

                publicacionesRegistradas.add(cambio.propiedad.id);
            }

            if (cambio.estadoNuevo === EstadoPropiedad.VENDIDA) {
                obtenerMes(mes).ventas++;
            }

            if (cambio.estadoNuevo === EstadoPropiedad.ALQUILADA) {
                obtenerMes(mes).alquileres++;
            }
        }
        return Array.from(meses.values()).sort((a, b) =>
            a.mes.localeCompare(b.mes)
        );
    },

    async promedioTiempoEnMercado(inmobiliariaId: number, vendedorId: number) {
        await verificarAcceso(inmobiliariaId, vendedorId);
        const historial = await reportesRepository.listarHistorialParaReportes(inmobiliariaId);
        const fechasPorPropiedad = new Map<number, {
            publicacion?: Date;
            cierre?: Date,
        }
        >();

        for (const cambio of historial) {
            const propiedadId = cambio.propiedad.id;
            const fechas = fechasPorPropiedad.get(propiedadId) ?? {};

            // uso la primera fecha en que la propiedad fue publicada
            if (cambio.estadoNuevo === EstadoPropiedad.PUBLICADA && !fechas.publicacion) {
                fechas.publicacion = cambio.creadoEn;
            }

            // El cierre pasa al vender o alquilar la propiedad
            if (
                (cambio.estadoNuevo === EstadoPropiedad.VENDIDA ||
                    cambio.estadoNuevo === EstadoPropiedad.ALQUILADA) &&
                !fechas.cierre
            ) {
                fechas.cierre = cambio.creadoEn;
            }
            fechasPorPropiedad.set(propiedadId, fechas);
        }

        const milisegundosPorDia = 1000 * 60 * 60 * 24;
        const tiemposEnDias: number[] = [];

        for (const fechas of fechasPorPropiedad.values()) {
            if (fechas.publicacion && fechas.cierre) {
                const dias = (fechas.cierre.getTime() - fechas.publicacion.getTime()) / milisegundosPorDia;
                tiemposEnDias.push(dias);
            }
        }
        if (tiemposEnDias.length === 0) {
            return {
                promedioDias: 0,
                propiedadesConsideradas: 0,
            };
        }

        const totalDias = tiemposEnDias.reduce((total, dias) =>
            total + dias, 0
        );

        const promedioDias = totalDias / tiemposEnDias.length;

        return {
            promedioDias: Number(promedioDias.toFixed(2)),
            propiedadesConsideradas: tiemposEnDias.length,
        };
    }
};