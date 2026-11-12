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

// Valida que la propiedad tenga fotos y que la portada pertenezca a la galeria
function validarFotos(fotos: string[], fotoPortada: string): void {
    if (fotos.length === 0) {
        throw new BadRequestError("La propiedad debe tener al menos una foto");
    }

    if(fotos.some((foto) => foto.trim().length === 0)) {
        throw new BadRequestError("Las fotos no pueden estar vacías");
    }

    if (!fotoPortada.trim()) {
        throw new BadRequestError("La propiedad debe tener una foto de portada");
    }

    if (!fotos.includes(fotoPortada)) {
        throw new BadRequestError("La foto de portada debe pertenecer a la galería de fotos");
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
        EstadoPropiedad.VENDIDA,
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

    async listarPropias(vendedorId: number): Promise<Propiedad[]> {
        const inmobiliaria = await inmobiliariasRepository.buscarPorVendedorId(vendedorId);
        
        if (!inmobiliaria) {
            throw new NotFoundError("Inmobiliaria no encontrada");
        }

        return propiedadesRepository.listarTodasPorInmobiliaria(inmobiliaria.id);
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

        validarFotos(datos.fotos, datos.fotoPortada);
        
        // La inmobiliaria se obtiene desde el vendedor autenticado
        const inmobiliaria = await inmobiliariasRepository.buscarPorVendedorId(vendedorId);

        if (!inmobiliaria) {
            throw new NotFoundError(`Inmobiliaria no encontrada`);
        }

        // Las propiedades nuevas empiezan en estado BORRADOR
        return propiedadesRepository.crear({
            ...datos,
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

        if (cambios.fotos !== undefined || cambios.fotoPortada !== undefined) {
            const fotos = cambios.fotos ?? propiedad.fotos;
            const fotoPortada = cambios.fotoPortada ?? propiedad.fotoPortada;
            validarFotos(fotos, fotoPortada);
        }

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