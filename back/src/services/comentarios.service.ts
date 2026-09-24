import { Comentario } from "../entities/comentario";
import { propiedadesRepository } from "../repositories/propiedades.repository";
import { comentariosRepository } from "../repositories/comentarios.repository";
import { CrearComentarioDto, ResponderComentarioDto } from "../controllers/comentarios.dto";
import { NotFoundError } from "../errors/propiedades.errors";
import { ConflictError } from "../errors/inmobiliaria.errors";
import { ForbiddenError } from "../errors/auth.errors";
import { actividadesRepository } from "../repositories/actividades.respository";
import { TipoActividad } from "../entities/enums";

export const comentariosService = {
    async crear(propiedadId: number, datos: CrearComentarioDto): Promise<Comentario> {
        const propiedad = await propiedadesRepository.buscarPorId(propiedadId);

        if(!propiedad) {
            throw new NotFoundError(`Propiedad ${propiedadId} no encontrada`);
        }

        const comentario = await comentariosRepository.crear({
            nombreAutor: datos.nombreAutor,
            contenido: datos.contenido,
            propiedad,
        });

        // La consulta nueva genera una notificacion para la inmobiiliaria
        await actividadesRepository.crear({
            tipo: TipoActividad.COMENTARIO,
            referenciaOrigen: comentario.id,
            inmobiliaria: propiedad.inmobiliaria,
        });

        return comentario;
    },

    async listarPorPropiedad(propiedadId: number): Promise<Comentario[]> {
        const propiedad = await propiedadesRepository.buscarPorId(propiedadId);

        if(!propiedad) {
            throw new NotFoundError(`Propiedad ${propiedadId} no encontrada`);
        }

        return comentariosRepository.listarPorPropiedad(propiedadId);
    },

    async responder(comentarioId: number, datos: ResponderComentarioDto, vendedorId: number): Promise<Comentario> {
        const comentario = await comentariosRepository.buscarPorId(comentarioId);

        if(!comentario) {
            throw new NotFoundError(`Propiedad ${comentarioId} no encontrado`);
        }

        // Solo el vendedor dueño de la propiedad puede responder
        const esPropietario = await comentariosRepository.perteneceAVendedor(comentarioId, vendedorId);

        if (!esPropietario) {
            throw new ForbiddenError("No tenés permiso para responder este comentario");
        }

        // Cada comentario permite solo una respuiesta
        if (comentario.respuesta) {
            throw new ConflictError("Este comentario ya fue respondido");
        }

        return comentariosRepository.responder(comentario, datos.respuesta);
    },
};