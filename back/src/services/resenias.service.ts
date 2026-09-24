import { Resenia } from "../entities/resenia";
import { CrearReseniaDto } from "../controllers/resenias.dto";
import { reseniasRepository } from "../repositories/resenias.repository";
import { inmobiliariasRepository } from "../repositories/inmobiliarias.repository";
import { NotFoundError } from "../errors/propiedades.errors";
import { actividadesRepository } from "../repositories/actividades.respository";
import { TipoActividad } from "../entities/enums";

export const reseniasService = {
    async crear(inmobiliariaId: number, datos: CrearReseniaDto): Promise<Resenia> {
        const inmobiliaria = await inmobiliariasRepository.buscarPorId(inmobiliariaId);

        if (!inmobiliaria) {
            throw new NotFoundError(`Inmobiliaria ${inmobiliariaId} no encontrada`)
        }

        const resenia = await reseniasRepository.crear({
            nombreAutor: datos.nombreAutor,
            contenido: datos.contenido,
            calificacion: datos.calificacion,
            inmobiliaria,
        });

        // La reseña nueva aparece en el feed de la inmobiliaria
        await actividadesRepository.crear({
            tipo: TipoActividad.RESENA,
            referenciaOrigen: resenia.id,
            inmobiliaria,
        });

        return resenia;
    },

    async listarPorInmobiliaria(inmobiliariaId: number): Promise<Resenia[]> {
        const inmobiliaria = await inmobiliariasRepository.buscarPorId(inmobiliariaId);

        if (!inmobiliaria) {
            throw new NotFoundError(`Inmobiliaria ${inmobiliariaId} no encontrada`)
        }
        
        return reseniasRepository.listarPorInmobiliaria(inmobiliariaId);
    },
};