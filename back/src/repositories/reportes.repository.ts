import { AppDataSource } from "../config/data-source"
import { EstadoPropiedad } from "../entities/enums"
import { HistorialEstadoPropiedad } from "../entities/historial-estado-propiedad"
import { Propiedad } from "../entities/propiedad"

export type CantidadPorEstado = { estado: EstadoPropiedad, cantidad: number; };

export class ReportesRepository {
    private get propiedadRepo() {
        return AppDataSource.getRepository(Propiedad);
    }

    private get historialRepo() {
        return AppDataSource.getRepository(HistorialEstadoPropiedad);

    }

    async contarPropiedadesPorEstado(inmobiliariaId: number): Promise<CantidadPorEstado[]> {
        const filas = await this.propiedadRepo
            .createQueryBuilder("propiedad")
            .innerJoin("propiedad.inmobiliaria", "inmobiliaria")
            .select("propiedad.estado", "estado")
            .addSelect("COUNT(propiedad.id)", "cantidad")
            .where("inmobiliaria.id = :inmobiliariaId", { inmobiliariaId})
            .groupBy("propiedad.estado")
            .getRawMany<{
                estado: EstadoPropiedad;
                cantidad: string;
            }>();

        return filas.map((fila) => ({
            estado: fila.estado,
            cantidad: Number(fila.cantidad),
        }));
    }

    listarHistorialParaReportes(inmobiliariaId: number): Promise<HistorialEstadoPropiedad[]> {
        return this.historialRepo
        .createQueryBuilder("historial")
        .innerJoinAndSelect("historial.propiedad", "propiedad")
        .innerJoin("propiedad.inmobiliaria", "inmobiliaria")
        .where("inmobiliaria.id = :inmobiliariaId", { inmobiliariaId})
        .andWhere("historial.estadoNuevo IN (:...estados)", {
            estados: [
                EstadoPropiedad.PUBLICADA,
                EstadoPropiedad.VENDIDA,
                EstadoPropiedad.ALQUILADA,
            ],
        })
        .orderBy("historial.creadoEn", "ASC")
        .getMany();
    }
}

export const reportesRepository = new ReportesRepository();