import { AppDataSource } from "../config/data-source";
import { Resenia } from "../entities/resenia";

export class ReseniasRepository {
    private get repo() {
        return AppDataSource.getRepository(Resenia);
    }

    async crear(datos: Partial<Resenia>): Promise<Resenia> {
        const resenia = this.repo.create(datos);

        return this.repo.save(resenia);
    }

    listarPorInmobiliaria(inmobiliariaId: number): Promise<Resenia[]> {
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
}

export const reseniasRepository = new ReseniasRepository();