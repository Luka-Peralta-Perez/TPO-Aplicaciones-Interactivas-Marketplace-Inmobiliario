import { AppDataSource } from "../config/data-source";
import { Propiedad } from "../entities/propiedad";
import { TipoPropiedad, Operacion, EstadoPropiedad } from "../entities/enums";

export type FiltrosPropiedad = {
    tipo?: TipoPropiedad;
    operacion?: Operacion;
    zona?: string;
    precioMin?: string;
    precioMax?: string;
    ambientes?: number;
    amenities?: string;
    q?: string;
    sort?: "precio" | "fechaPublicacion" | "superficieTotal";
    page?: number;
    limit?: number;
};

export type ResultadoPropiedades = {
    items: Propiedad[];
    total: number;
    page: number;
    limit: number;
};

export class PropiedadesRepository {
    private get repo() {
        return AppDataSource.getRepository(Propiedad);
    }

    perteneceAVendedor(propiedadId: number, vendedorId: number): Promise<boolean> {
        return this.repo.exists({
            where: {
                id: propiedadId,
                inmobiliaria: {
                    vendedor: {
                        id: vendedorId,
                    },
                },
            },
        });
    }

    async listar(filtros: FiltrosPropiedad = {}): Promise<ResultadoPropiedades> {
        const page = filtros.page ?? 1;

        // El listado permite como máximo 50 resultados por pag
        const limit = Math.min(filtros.limit ?? 10, 50);

        const qb = this.repo
            .createQueryBuilder("propiedad")
            .leftJoinAndSelect("propiedad.inmobiliaria", "inmobiliaria")
            // El listado publico sólo muestra propiedades publicadas
            .where("propiedad.estado = :estado", {
                estado: EstadoPropiedad.PUBLICADA,
            });

        if (filtros.tipo) {
            qb.andWhere("propiedad.tipo = :tipo", {
                tipo: filtros.tipo,
            });
        }

        if (filtros.operacion) {
            qb.andWhere("propiedad.operacion = :operacion", {
                operacion: filtros.operacion,
            });
        }

        if (filtros.zona) {
            qb.andWhere("propiedad.zona ILIKE :zona", {
                zona: `%${filtros.zona}%`,
            });
        }

        if (filtros.precioMin) {
            qb.andWhere("propiedad.precio >= :precioMin", {
                precioMin: filtros.precioMin,
            });
        }

        if (filtros.precioMax) {
            qb.andWhere("propiedad.precio <= :precioMax", {
                precioMax: filtros.precioMax,
            });
        }

        if (filtros.ambientes) {
            qb.andWhere("propiedad.ambientes = :ambientes", {
                ambientes: filtros.ambientes,
            });
        }

        if (filtros.q) {
            qb.andWhere(`(propiedad.titulo ILIKE :q OR propiedad.descripcion ILIKE :q)`,
                {
                    q: `%${filtros.q}%`,
                }
            );
        }

        if (filtros.amenities) {
            const amenities = filtros.amenities
              .split(",")
              .map((amenity) => amenity.trim())
              .filter((amenity) => amenity.length > 0);

            // Si se piden varias amenities, la propiedad tiene que contener todas
            amenities.forEach((amenity, index) => {
                qb.andWhere(`propiedad.amenities ILIKE :amenity${index}`,
                    {
                        [`amenity${index}`]: `%${amenity}%`,
                    }
                );
            });
        }

        // Si no viene sort, mostramos primero las propiedades mas recientes
        switch (filtros.sort) {
            case "precio":
                qb.orderBy("propiedad.precio", "ASC");
                break;

            case "superficieTotal":
                qb.orderBy("propiedad.superficieTotalM2", "ASC");
                break;
            
            case "fechaPublicacion":
                qb.orderBy("propiedad.creadoEn", "DESC");
                break;

            default:
                qb.orderBy("propiedad.creadoEn", "DESC");
        }

        const [items, total] = await qb 
          .skip((page - 1) * limit)
          .take(limit)
          .getManyAndCount();

        return {
            items,
            total,
            page,
            limit,
        };

    }

    // Busco una propiedad por ID. Si no existe, devuelvo null
    buscarPorId(id: number): Promise<Propiedad | null> {
        return this.repo.findOne({
            where: { id },
            relations: {
                inmobiliaria: true,
            },
        });
    }

    // Creo y guardo una nueva propiedad
    async crear(datos: Partial<Propiedad>): Promise<Propiedad> {
        const propiedad = this.repo.create(datos);

        return await this.repo.save(propiedad);
    }

    // Actualizo una propiedad. Si no existe, devuelve undefined
    async actualizar(id: number, cambios: Partial<Propiedad>): Promise<Propiedad | undefined> {
        const propiedad = await this.repo.findOneBy({ id });

        if (!propiedad) {
            return undefined;
        }

        this.repo.merge(propiedad, cambios);

        return await this.repo.save(propiedad);
    }

    // Elimino una propiedad. Devuelve true si se eliminó correctamente
    async eliminar(id: number): Promise<boolean> {
        const resultado = await this.repo.delete({ id });

        return (resultado.affected ?? 0) > 0;
    }
}

export const propiedadesRepository = new PropiedadesRepository();