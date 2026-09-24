import { Propiedad } from "../entities/propiedad";
import { EstadoPropiedad } from "../entities/enums";
import { propiedadesRepository, ResultadoPropiedades } from "../repositories/propiedades.repository";
import { inmobiliariasRepository } from "../repositories/inmobiliarias.repository";
import { NotFoundError, BadRequestError } from "../errors/propiedades.errors";
import { CrearPropiedadDto, ActualizarPropiedadDto, FiltrarPropiedadesDto, CambiarEstadoPropiedadDto } from "../controllers/propiedades.dto";
import { ConflictError } from "../errors/inmobiliaria.errors";
import { solicitudesVisitaRepository } from "../repositories/solicitudes-visita.repository";
import { ForbiddenError } from "../errors/auth.errors";
import { AppDataSource } from "../config/data-source";
import { HistorialEstadoPropiedad } from "../entities/historial-estado-propiedad";
import { historialEstadoPropiedadRepository } from "../repositories/historial-estado-propiedad.repository";

// Valida las reglas de negocio para precio y superficies
function validarValoresPositivos(precio?: string, superficieTotalM2?: string, superficieCubiertaM2?: string): void {
    if (precio !== undefined && Number(precio) <= 0) {
        throw new BadRequestError("El precio debe ser mayor a 0");
    }

    if (superficieTotalM2 !== undefined && Number(superficieTotalM2) <= 0) {
        throw new BadRequestError("La superficie total debe ser mayor a 0");
    }

    if (superficieCubiertaM2 !== undefined && Number(superficieCubiertaM2) <= 0) {
        throw new BadRequestError("La superficie cubierta debe ser mayor a 0.");
    }
}

const ESTADOS_NO_EDITABLES = [
    EstadoPropiedad.VENDIDA,
    EstadoPropiedad.ALQUILADA,
    EstadoPropiedad.CANCELADA,
];

const TRANSICIONES_PERMITIDAS: Record<EstadoPropiedad, EstadoPropiedad[]> = {
    [EstadoPropiedad.BORRADOR]: [
        EstadoPropiedad.PUBLICADA,
        EstadoPropiedad.CANCELADA,
    ],
    [EstadoPropiedad.PUBLICADA]: [
        EstadoPropiedad.RESERVADA,
        EstadoPropiedad.PAUSADA,
        EstadoPropiedad.CANCELADA,
    ],
    [EstadoPropiedad.PAUSADA]: [
        EstadoPropiedad.PUBLICADA,
        EstadoPropiedad.CANCELADA,
    ],
    [EstadoPropiedad.RESERVADA]: [
        EstadoPropiedad.VENDIDA,
        EstadoPropiedad.ALQUILADA,
        EstadoPropiedad.CANCELADA,
    ],
    // los estados finales no tienen transiciones posteriores
    [EstadoPropiedad.VENDIDA]: [],
    [EstadoPropiedad.ALQUILADA]: [],
    [EstadoPropiedad.CANCELADA]: [],
};

export const propiedadesService = {
    async listar(filtros?: FiltrarPropiedadesDto): Promise<ResultadoPropiedades> {
        return propiedadesRepository.listar(filtros);
    },

    async obtener(id: number): Promise<Propiedad> {
        const propiedad = await propiedadesRepository.buscarPorId(id);

        if (!propiedad) {
            throw new NotFoundError(`Propiedad ${id} no encontrada`);
        }

        return propiedad;
    },

    async crear(datos: CrearPropiedadDto, vendedorId: number): Promise<Propiedad> {
        validarValoresPositivos(
            datos.precio, 
            datos.superficieTotalM2, 
            datos.superficieCubiertaM2
        );
        
        // La inmobiliaria tiene que existir antes de asociarla a una propiedad
        const inmobiliaria = await inmobiliariasRepository.buscarPorId(
            datos.inmobiliariaId
        );

        if (!inmobiliaria) {
            throw new NotFoundError(`Inmobiliaria ${datos.inmobiliariaId} no encontrada`);
        }

        // El vendedor sólo puede crear propiedades para su porpia inmobiliaria
        const esPropietario = await inmobiliariasRepository.perteneceAVendedor(datos.inmobiliariaId, vendedorId);

        if (!esPropietario) {
            throw new ForbiddenError("No tenés permiso para crear propiedades para esta inmobiliaria");
        }

        const { inmobiliariaId, ...datosPropiedad } = datos;

        // Las propiedades nuevas empiezan en estado BORRADOR
        return propiedadesRepository.crear({
            ...datosPropiedad,
            inmobiliaria,
            estado: EstadoPropiedad.BORRADOR,
        });
    },

    async actualizar(id: number, cambios: ActualizarPropiedadDto, vendedorId: number): Promise<Propiedad> {
        const propiedad = await propiedadesRepository.buscarPorId(id);

        if(!propiedad) {
            throw new NotFoundError(`Propiedad ${id} no encontrada`);
        }

        // Solo el vendedor dueño puede modificar esta propiedad
        const esPropietario = await propiedadesRepository.perteneceAVendedor(id, vendedorId);

        if(!esPropietario) {
            throw new ForbiddenError("No tenés permiso para editar esta propiedad");
        }

        // No se pueden modificar los datos de propiedades que están cerradas
        if (ESTADOS_NO_EDITABLES.includes(propiedad.estado)) {
            throw new ConflictError(`No se puede editar una propiedad en estado ${propiedad.estado}`);
        }

        const tieneVisitaConfirmada = await solicitudesVisitaRepository.tieneVisitaConfirmada(id);

        if (tieneVisitaConfirmada) {
            throw new ConflictError("No se puede editar la propiedad porque tiene una visita confirmada pendiente.");
        }

        validarValoresPositivos(
            cambios.precio,
            cambios.superficieTotalM2,
            cambios.superficieCubiertaM2
        );

        const actualizada = await propiedadesRepository.actualizar(id, cambios);

        if (!actualizada) {
            throw new NotFoundError(`Propiedad ${id} no encontrada`);
        }

        return actualizada;
    },

    async cambiarEstado(id: number, datos: CambiarEstadoPropiedadDto, vendedorId: number): Promise<Propiedad> {
        const propiedad = await propiedadesRepository.buscarPorId(id);

        if (!propiedad) {
            throw new NotFoundError(`Propiedad ${id} no encontrada`);
        }

        // Solo el dueño de la inmobiliaria puede cambiar el estado
        const esPropietario = await propiedadesRepository.perteneceAVendedor(id, vendedorId);

        if(!esPropietario) {
            throw new ForbiddenError("No tenés permiso para cambiar el estado de esta propiedad");
        }

        const estadoAnterior = propiedad.estado;
        const estadoNuevo = datos.estado;
        const permitidos = TRANSICIONES_PERMITIDAS[estadoAnterior];

        if (!permitidos.includes(estadoNuevo)) {
            throw new BadRequestError(`No se puede cambiar una propiedad de ${estadoAnterior} a ${estadoNuevo}`);
        }

        // El cambio de estado e historial se guardan juntos
        return AppDataSource.transaction(async (manager) => {
            const propiedadRepository = manager.getRepository(Propiedad);
            const historialRepository = manager.getRepository(HistorialEstadoPropiedad);

            propiedad.estado = estadoNuevo;

            const actualizada = await propiedadRepository.save(propiedad);
            const historial = historialRepository.create({
                propiedad: actualizada,
                estadoAnterior,
                estadoNuevo,
            });

            await historialRepository.save(historial);
            return actualizada;
        });
    },

    async obtenerHistorial(id: number, vendedorId: number): Promise<HistorialEstadoPropiedad[]> {
        const propiedad = await propiedadesRepository.buscarPorId(id);

        if (!propiedad) {
            throw new NotFoundError(`Propiedad ${id} no encontrada`);
        }

        const esPropietario = await propiedadesRepository.perteneceAVendedor(id, vendedorId);

        if (!esPropietario) {
            throw new ForbiddenError("No tenés permiso para consultar el historial de esta propiedad");
        }

        return historialEstadoPropiedadRepository.listarPorPropiedad(id);
    },

    async eliminar(id: number): Promise<void> {
        const eliminada = await propiedadesRepository.eliminar(id);

        if (!eliminada) {
            throw new NotFoundError(`Propiedad ${id} no encontrada`);
        }
    },
};