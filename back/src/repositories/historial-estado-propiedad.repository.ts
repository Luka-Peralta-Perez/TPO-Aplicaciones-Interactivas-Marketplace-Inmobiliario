import { AppDataSource } from "../config/data-source";
import { HistorialEstadoPropiedad } from "../entities/historial-estado-propiedad";

export class HistorialEstadoPropiedadRepository {
    private get repo() {
        return AppDataSource.getRepository(HistorialEstadoPropiedad);
    }

    listarPorPropiedad(propiedadId: number): Promise<HistorialEstadoPropiedad[]> {
        return this.repo.find({
            where: {
                propiedad: {
                    id: propiedadId,
                },
            },
            // El historial se devuelve desde el cambio mas antiguo al más nuevo
            order: {
                creadoEn: "ASC",
            },
        });
    }
}

export const historialEstadoPropiedadRepository = new HistorialEstadoPropiedadRepository();