import { Actividad } from "../entities/actividad";
import { actividadesRepository } from "../repositories/actividades.respository";
import { inmobiliariasRepository } from "../repositories/inmobiliarias.repository";
import { NotFoundError } from "../errors/propiedades.errors";
import { ForbiddenError } from "../errors/auth.errors";

export const actividadesService = {
    async listar(inmobiliariaId: number, vendedorId: number): Promise<Actividad[]> {
        const inmobiliaria = await inmobiliariasRepository.buscarPorId(inmobiliariaId);

        if (!inmobiliaria) {
            throw new NotFoundError(`Inmobiliaria ${inmobiliariaId} no encontrada`);
        }

        const esPropietario = await inmobiliariasRepository.perteneceAVendedor(inmobiliariaId, vendedorId);

        if (!esPropietario) {
            throw new ForbiddenError("No tenes permiso para ver la actividad de esta inmobiliaria");
        }

        return actividadesRepository.listarPorInmobiliaria(inmobiliariaId);
    },

    async contarNoLeidas(inmobiliariaId: number, vendedorId: number): Promise<number> {
        const inmobiliaria = await inmobiliariasRepository.buscarPorId(inmobiliariaId);

        if (!inmobiliaria) {
            throw new NotFoundError(`Inmobiliaria ${inmobiliariaId} no encontrada`);
        }

        const esPropietario = await inmobiliariasRepository.perteneceAVendedor(inmobiliariaId, vendedorId);

        if (!esPropietario) {
            throw new ForbiddenError("No tenes permiso para ver la actividad de esta inmobiliaria");
        }

        return actividadesRepository.contarNoLeidas(inmobiliariaId);
    },

    async marcarComoLeida(actividadId: number, vendedorId: number): Promise<Actividad> {
        const actividad = await actividadesRepository.buscarPorId(actividadId);

        if (!actividad) {
            throw new NotFoundError(`Actividad ${actividadId} no encontrada`);
        }

        const esPropietario = await actividadesRepository.perteneceAVendedor(actividadId, vendedorId);

        if (!esPropietario) {
            throw new ForbiddenError("No tenes permiso para modificar esta actividad");
        }

        return actividadesRepository.marcarComoLeida(actividad);
    },
};