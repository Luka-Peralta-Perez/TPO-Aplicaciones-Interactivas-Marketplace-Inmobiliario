import { AppDataSource } from "../config/data-source";
import { SolicitudVisita } from "../entities/solicitud-visita";
import { EstadoSolicitudVisita } from "../entities/enums";

export class SolicitudesVisitaRepository {
    private get repo() {
        return AppDataSource.getRepository(SolicitudVisita);
    }

    buscarPorId(id: number): Promise<SolicitudVisita | null> {
        return this.repo.findOne({
            where: { id },
            relations: {
                propiedad: true,
            },
        });
    }

    async crear(datos: Partial<SolicitudVisita>): Promise<SolicitudVisita> {
        const solicitud = this.repo.create(datos);

        return this.repo.save(solicitud);
    }

    listarPorInmobiliaria(inmobiliariaId: number): Promise<SolicitudVisita[]> {
        return this.repo.find({
            where: {
                propiedad: {
                    inmobiliaria: {
                        id: inmobiliariaId,
                    },
                },
            },
            relations: {
                propiedad: true,
            },
            order: {
                creadoEn: "DESC",
            },
        });
    }

    perteneceAVendedor(solicitudId: number, vendedorId: number): Promise<boolean> {
        return this.repo.exists({
            where: {
                id: solicitudId,
                propiedad: {
                    inmobiliaria: {
                        vendedor: {
                            id: vendedorId,
                        },
                    },
                },
            },
        });
    }

    async cambiarEstado(solicitud: SolicitudVisita, estado: EstadoSolicitudVisita): Promise<SolicitudVisita> {
        solicitud.estado = estado;

        return this.repo.save(solicitud);
    }

    async tieneVisitaConfirmada(propiedadId: number): Promise<boolean> {
        return this.repo.exists({
            where: {
                propiedad: { id: propiedadId },
                estado: EstadoSolicitudVisita.CONFIRMADA,
            },
        });
    }
}

export const solicitudesVisitaRepository = new SolicitudesVisitaRepository();