import { SolicitudVisita } from "../entities/solicitud-visita";
import { EstadoSolicitudVisita } from "../entities/enums";
import { CrearSolicitudVisitaDto, CambiarEstadoSolicitudVisitaDto } from "../controllers/solicitudes-visita.dto";
import { propiedadesRepository } from "../repositories/propiedades.repository";
import { inmobiliariasRepository } from "../repositories/inmobiliarias.repository";
import { solicitudesVisitaRepository } from "../repositories/solicitudes-visita.repository";
import { NotFoundError, BadRequestError } from "../errors/propiedades.errors";
import { ForbiddenError } from "../errors/auth.errors";
import { actividadesRepository } from "../repositories/actividades.respository";
import { TipoActividad } from "../entities/enums";

const TRANSICIONES_PERMITIDAS: Record<EstadoSolicitudVisita, EstadoSolicitudVisita[]> = {
    [EstadoSolicitudVisita.PENDIENTE]: [
        EstadoSolicitudVisita.CONFIRMADA,
        EstadoSolicitudVisita.CANCELADA,
        EstadoSolicitudVisita.RECHAZADA,
    ],
    [EstadoSolicitudVisita.CONFIRMADA]: [
        EstadoSolicitudVisita.REALIZADA,
        EstadoSolicitudVisita.CANCELADA,
        EstadoSolicitudVisita.RECHAZADA,
    ],
    [EstadoSolicitudVisita.REALIZADA]: [],
    [EstadoSolicitudVisita.CANCELADA]: [],
    [EstadoSolicitudVisita.RECHAZADA]: [],
};

export const solicitudesVisitaService = {
    async crear(propiedadId: number, datos: CrearSolicitudVisitaDto): Promise<SolicitudVisita> {
        const propiedad = await propiedadesRepository.buscarPorId(propiedadId);

        if (!propiedad) {
            throw new NotFoundError(`Propiedad ${propiedadId} no encontrada`);
        }

        const fechaPropuesta = new Date(datos.fechaPropuesta);

        // La visita tiene que ser a futuro
        if (fechaPropuesta <= new Date()) {
            throw new BadRequestError("La fecha propuesta debe ser futura");
        }

        const solicitud = await solicitudesVisitaRepository.crear({
            nombreSolicitante: datos.nombreSolicitante,
            telefono: datos.telefono,
            fechaPropuesta,
            mensaje: datos.mensaje,
            propiedad,
            estado: EstadoSolicitudVisita.PENDIENTE,
        });

        // Una nueva visita genera una act para el vendendor
        await actividadesRepository.crear({
            tipo: TipoActividad.SOLICITUD_VISITA,
            referenciaOrigen: solicitud.id,
            inmobiliaria: propiedad.inmobiliaria,
        });

        return solicitud;
    },

    async cambiarEstado(solicitudId: number, datos: CambiarEstadoSolicitudVisitaDto, vendedorId: number): Promise<SolicitudVisita> {
        const solicitud = await solicitudesVisitaRepository.buscarPorId(solicitudId);

        if (!solicitud) {
            throw new NotFoundError(`Solicitud de visita ${solicitudId} no encontrada`);
        }

        const esPropietario = await solicitudesVisitaRepository.perteneceAVendedor(solicitudId, vendedorId);

        if (!esPropietario) {
            throw new ForbiddenError("No tenés permiso para modificar esta solicitud de visita");
        }

        const permitidos = TRANSICIONES_PERMITIDAS[solicitud.estado];

        if (!permitidos.includes(datos.estado)) {
            throw new BadRequestError(`No se puede cambiar una solicitud de ${solicitud.estado} a ${datos.estado}`);
        }

        return solicitudesVisitaRepository.cambiarEstado(solicitud, datos.estado);

    },
    
    async listarPorInmobiliaria(inmobiliariaId: number, vendedorId: number): Promise<SolicitudVisita[]> {
        const inmobiliaria = await inmobiliariasRepository.buscarPorId(inmobiliariaId);

        if (!inmobiliaria) {
            throw new NotFoundError(`Inmobiliaria ${inmobiliariaId} no encontrada`);
        }

        const esPropietario = await inmobiliariasRepository.perteneceAVendedor(inmobiliariaId, vendedorId);

        if (!esPropietario) {
            throw new ForbiddenError("No tenés permiso para ver las solicitudes de esta inmobiliaria");
        }

        return solicitudesVisitaRepository.listarPorInmobiliaria(inmobiliariaId);
    },
};