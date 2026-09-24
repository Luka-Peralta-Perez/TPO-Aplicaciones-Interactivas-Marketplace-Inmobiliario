import { AppDataSource } from "../config/data-source";
import { Actividad } from "../entities/actividad";

export class ActividadesRepository {
    private get repo() {
        return AppDataSource.getRepository(Actividad);
    }

    async crear(datos: Partial<Actividad>): Promise<Actividad> {
        const actividad = this.repo.create(datos);

        return this.repo.save(actividad);
    }

    buscarPorId(id: number): Promise<Actividad | null> {
        return this.repo.findOne({
            where: { id },
            relations: {
                inmobiliaria: true,
            },
        });
    }

    listarPorInmobiliaria(inmobiliariaId: number): Promise<Actividad[]> {
        return this.repo.find({
            where: {
                inmobiliaria: {
                    id: inmobiliariaId,
                },
            },
            order: {
                creadoEn: "DESC",
            },
        });
    }

    contarNoLeidas(inmobiliariaId: number): Promise<number> {
        return this.repo.count({
            where: {
                inmobiliaria: {
                    id: inmobiliariaId,
                },
                leida: false,
            },
        });
    }

    perteneceAVendedor(actividadId: number, vendedorId: number): Promise<boolean> {
        return this.repo.exists({
            where: {
                id: actividadId,
                inmobiliaria: {
                    vendedor: {
                        id: vendedorId,
                    },
                },
            },
        });
    }

    async marcarComoLeida(actividad: Actividad): Promise<Actividad> {
        actividad.leida = true;

        return this.repo.save(actividad);
    }
}

export const actividadesRepository = new ActividadesRepository();