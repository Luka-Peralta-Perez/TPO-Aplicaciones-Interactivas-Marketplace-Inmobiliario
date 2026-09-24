import { Propiedad } from "../entities/propiedad";
import { EstadoPropiedad } from "../entities/enums";
import { propiedadesRepository } from "../repositories/propiedades.repository";
import { inmobiliariasRepository } from "../repositories/inmobiliarias.repository";
import { NotFoundError } from "../errors/propiedades.errors";
import { CrearPropiedadDto, ActualizarPropiedadDto } from "../controllers/propiedades.dto";

export const propiedadesService = {
    async listar(): Promise<Propiedad[]> {
        return propiedadesRepository.listar();
    },

    async obtener(id: string): Promise<Propiedad> {
        const propiedad = await propiedadesRepository.buscarPorId(id);

        if (!propiedad) {
            throw new NotFoundError(`Propiedad ${id} no encontrada`);
        }

        return propiedad;
    },

    async crear(datos: CrearPropiedadDto): Promise<Propiedad> {
        // La inmobiliaria tiene que existir antes de asociarla a una propiedad
        const inmobiliaria = await inmobiliariasRepository.buscarPorId(
            datos.inmobiliariaId
        );

        if (!inmobiliaria) {
            throw new NotFoundError(`Inmobiliaria ${datos.inmobiliariaId} no encontrada`);
        }

        const { inmobiliariaId, ...datosPropiedad } = datos;

        // Toda propiedad nueva empieza en estado BORRADOR, sin importar el estado que envie el cliente
        return propiedadesRepository.crear({
            ...datosPropiedad,
            inmobiliaria,
            estado: EstadoPropiedad.BORRADOR,
        });
    },

    async actualizar(id: string, cambios: ActualizarPropiedadDto): Promise<Propiedad> {
        const propiedad = await propiedadesRepository.buscarPorId(id);

        if(!propiedad) {
            throw new NotFoundError(`Propiedad ${id} no encontrada`);
        }

        const actualizada = await propiedadesRepository.actualizar(id, cambios);

        if (!actualizada) {
            throw new NotFoundError(`Propiedad ${id} no encontrada`);
        }

        return actualizada;
    },

    async eliminar(id: string): Promise<void> {
        const eliminada = await propiedadesRepository.eliminar(id);

        if (!eliminada) {
            throw new NotFoundError(`Propiedad ${id} no encontrada`);
        }
    },
};