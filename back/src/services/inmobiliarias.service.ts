import { Inmobiliaria } from "../entities/inmobiliaria";
import { Propiedad } from "../entities/propiedad";
import { inmobiliariasRepository } from "../repositories/inmobiliarias.repository";
import { NotFoundError } from "../errors/propiedades.errors";
import { ConflictError } from "../errors/inmobiliaria.errors";
import { ActualizarInmobiliariaDto } from "../controllers/inmobiliaria.dto";
import { ForbiddenError } from "../errors/auth.errors";

export const inmobiliariasService = {
    async obtener(id: number): Promise<Inmobiliaria> {
        const inmobiliaria = await inmobiliariasRepository.buscarPorId(id);

        if (!inmobiliaria) {
            throw new NotFoundError(`Inmobiliaria ${id} no encontrada`);
        }
        return inmobiliaria
    },

    async actualizar(id: number, cambios: ActualizarInmobiliariaDto, vendedorId: number): Promise<Inmobiliaria> {
        const inmobiliaria = await inmobiliariasRepository.buscarPorId(id);

        if (!inmobiliaria) {
            throw new NotFoundError(`Inmobiliaria ${id} no encontrada`);
        }

        // El vendedor autenticado sólo puede modificar su propia inmobiliaria
        const esPropietario = await inmobiliariasRepository.perteneceAVendedor(id, vendedorId);

        if (!esPropietario) {
            throw new ForbiddenError("No tenés permiso para editar esta inmobiliaria");
        }

        const actualizada = await inmobiliariasRepository.actualizar(id, cambios);

        if (!actualizada) {
            throw new NotFoundError(`Inmobiliaria ${id} no encontrada`);
        }
        return actualizada;
    },

    async eliminar(id: number, vendedorId: number): Promise<void> {
        const inmobiliaria = await inmobiliariasRepository.buscarPorId(id);

        if (!inmobiliaria) {
            throw new NotFoundError(`Inmobiliaria ${id} no encontrada`);
        }

        // Verifica que la inmobiliaria pertenezca al vendedor autenticado
        const esPropietario = await inmobiliariasRepository.perteneceAVendedor(id, vendedorId);

        if (!esPropietario) {
            throw new ForbiddenError("No tenés permiso para eliminar esta inmobiliaria");
        }

        // No se puede eliminar si tiene propiedades publicadas o reservadas
        const tienePropiedadesActivas = await inmobiliariasRepository.tienePropiedadesActivas(id);

        if (tienePropiedadesActivas) {
            throw new ConflictError("No se puede eliminar la inmobiliaria porque tiene propiedades publicadas o reservadas.");
        }

        await inmobiliariasRepository.eliminar(id);
    },

    async listarPropiedadesPublicadas(id: number): Promise<Propiedad[]> {
        const inmobiliaria = await inmobiliariasRepository.buscarPorId(id);

        if (!inmobiliaria) {
            throw new NotFoundError(`Inmobiliaria ${id} no encontrada`);
        }
        return inmobiliariasRepository.listarPropiedadesPublicadas(id);
    },
};