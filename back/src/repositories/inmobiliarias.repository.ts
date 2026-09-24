import { AppDataSource } from "../config/data-source";
import { Inmobiliaria } from "../entities/inmobiliaria";
import { In } from "typeorm";
import { Propiedad } from "../entities/propiedad";
import { EstadoPropiedad } from "../entities/enums";

export class InmobiliariasRepository {
    private get repo() {
        return AppDataSource.getRepository(Inmobiliaria);
    }

    existePorNombre(nombre: string): Promise<boolean> {
        return this.repo.exists({
            where: { nombre },
        });
    }

    perteneceAVendedor(inmobiliariaId: number, vendedorId: number): Promise<boolean> {
        return this.repo.exists({
            where: {
                id: inmobiliariaId,
                vendedor: {
                    id: vendedorId,
                },
            },
        });
    }
       

    // Devuelve todas las inmobiliarias
    listar(): Promise<Inmobiliaria[]> {
        return this.repo.find();
    }

    // Busca una inmobiliaria por id. Si no existe, devuelve null
    buscarPorId(id: number): Promise<Inmobiliaria | null> {
        return this.repo.findOneBy({ id });
    }

    // Crea y guarda una inmobiliaria
    async crear(datos: Partial<Inmobiliaria>): Promise<Inmobiliaria> {
        const inmobiliaria = this.repo.create(datos);

        return await this.repo.save(inmobiliaria);
    }

    // Actualiza los datos de una inmobilaria
    async actualizar(id: number, cambios: Partial<Inmobiliaria>): Promise<Inmobiliaria | undefined> {
        const inmobiliaria = await this.repo.findOneBy({ id });

        if (!inmobiliaria) {
            return undefined;
        }

        this.repo.merge(inmobiliaria, cambios);

        return await this.repo.save(inmobiliaria);
    }

    // Elimina una inmobiliaria
    async eliminar(id: number): Promise<boolean> {
        const resultado = await this.repo.delete({ id });

        return (resultado.affected ?? 0) > 0;
    }

    // Verifica si la inmobiliaria tiene propiedades que no dejan eliminarla
    async tienePropiedadesActivas(id: number): Promise<boolean> {
        const propiedadRepo = AppDataSource.getRepository(Propiedad);

        return propiedadRepo.exists({
            where: {
                inmobiliaria: { id },
                estado: In([
                    EstadoPropiedad.PUBLICADA,
                    EstadoPropiedad.RESERVADA,
                ]),
            },
        });
    }

    // Devuelve solo las propiedades publicadas de la inmobiliaria
    listarPropiedadesPublicadas(id: number): Promise<Propiedad[]> {
        const propiedadRepo = AppDataSource.getRepository(Propiedad);

        return propiedadRepo.find({
            where: {
                inmobiliaria: { id },
                estado: EstadoPropiedad.PUBLICADA,
            },
            order: {
                creadoEn: "DESC",
            },
        });
    }
}

export const inmobiliariasRepository = new InmobiliariasRepository();

