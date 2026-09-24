import { AppDataSource } from "../config/data-source";
import { Comentario } from "../entities/comentario";

export class ComentariosRepository {
    private get repo() {
        return AppDataSource.getRepository(Comentario);
    }

    buscarPorId(id: number): Promise<Comentario | null> {
        return this.repo.findOne({
            where: { id },
            relations: {
                propiedad: true,
            },
        });
    }

    listarPorPropiedad(propiedadId: number): Promise<Comentario[]> {
        return this.repo.find({
            where: {
                propiedad: {
                    id: propiedadId,
                },
            },
            order: {
                creadoEn: "ASC",
            },
        });
    }

    async crear(datos: Partial<Comentario>): Promise<Comentario> {
        const comentario = this.repo.create(datos);

        return this.repo.save(comentario);
    }

    perteneceAVendedor(comentarioId: number, vendedorId: number): Promise<boolean> {
        return this.repo.exists({
            where: {
                id: comentarioId,
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

    async responder(comentario: Comentario, respuesta: string): Promise<Comentario> {
        comentario.respuesta = respuesta;
        return this.repo.save(comentario);
    }
}

export const comentariosRepository = new ComentariosRepository();