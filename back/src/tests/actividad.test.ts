import "reflect-metadata";
import test from "node:test";
import assert from "node:assert/strict";
import { comentariosService } from "../services/comentarios.service";
import { solicitudesVisitaService } from "../services/solicitudes-visita.service";
import { reseniasService } from "../services/resenias.service";
import { propiedadesRepository } from "../repositories/propiedades.repository";
import { inmobiliariasRepository } from "../repositories/inmobiliarias.repository";
import { comentariosRepository } from "../repositories/comentarios.repository";
import { solicitudesVisitaRepository } from "../repositories/solicitudes-visita.repository";
import { reseniasRepository } from "../repositories/resenias.repository";
import { actividadesRepository } from "../repositories/actividades.respository";
import { TipoActividad } from "../entities/enums";

test(
    "cada evento relevante genera una Activity automáticamente",
    async () => {
        const inmobiliaria = {
            id: 1,
            nombre: "Inmobiliaria Test",
        } as any;

        const propiedad = {
            id: 10,
            titulo: "Casa Test",
            inmobiliaria,
        } as any;

        const actividadesGeneradas: any[] = [];

        // Guardamos los métodos originales para restaurarlos al terminar
        const buscarPropiedadOriginal =
            propiedadesRepository.buscarPorId;

        const buscarInmobiliariaOriginal =
            inmobiliariasRepository.buscarPorId;

        const crearComentarioOriginal =
            comentariosRepository.crear;

        const crearSolicitudOriginal =
            solicitudesVisitaRepository.crear;

        const crearReseniaOriginal =
            reseniasRepository.crear;

        const crearActividadOriginal =
            actividadesRepository.crear;

        try {
            propiedadesRepository.buscarPorId =
                async () => propiedad;

            inmobiliariasRepository.buscarPorId =
                async () => inmobiliaria;

            comentariosRepository.crear =
                async (datos: any) => ({
                    id: 101,
                    ...datos,
                });

            solicitudesVisitaRepository.crear =
                async (datos: any) => ({
                    id: 202,
                    ...datos,
                });

            reseniasRepository.crear =
                async (datos: any) => ({
                    id: 303,
                    ...datos,
                });

            actividadesRepository.crear =
                async (datos: any) => {
                    actividadesGeneradas.push(datos);

                    return {
                        id: actividadesGeneradas.length,
                        leida: false,
                        creadoEn: new Date(),
                        ...datos,
                    };
                };

            // 1. Crear comentario
            await comentariosService.crear(10, {
                nombreAutor: "Lucía",
                contenido: "¿Tiene calefacción?",
            });

            // 2. Crear solicitud de visita
            await solicitudesVisitaService.crear(10, {
                nombreSolicitante: "Federico",
                telefono: "2254-555555",
                fechaPropuesta: "2099-10-10T15:00:00.000Z",
                mensaje: "Quiero conocer la propiedad",
            });

            // 3. Crear reseña
            await reseniasService.crear(1, {
                nombreAutor: "Martina",
                contenido: "Muy buena atención",
                calificacion: 5,
            });

            assert.equal(
                actividadesGeneradas.length,
                3
            );

            assert.equal(
                actividadesGeneradas[0].tipo,
                TipoActividad.COMENTARIO
            );

            assert.equal(
                actividadesGeneradas[0].referenciaOrigen,
                101
            );

            assert.equal(
                actividadesGeneradas[0].inmobiliaria.id,
                1
            );

            assert.equal(
                actividadesGeneradas[1].tipo,
                TipoActividad.SOLICITUD_VISITA
            );

            assert.equal(
                actividadesGeneradas[1].referenciaOrigen,
                202
            );

            assert.equal(
                actividadesGeneradas[1].inmobiliaria.id,
                1
            );

            assert.equal(
                actividadesGeneradas[2].tipo,
                TipoActividad.RESENA
            );

            assert.equal(
                actividadesGeneradas[2].referenciaOrigen,
                303
            );

            assert.equal(
                actividadesGeneradas[2].inmobiliaria.id,
                1
            );
        } finally {
            // Dejamos los repositories como estaban
            propiedadesRepository.buscarPorId =
                buscarPropiedadOriginal;

            inmobiliariasRepository.buscarPorId =
                buscarInmobiliariaOriginal;

            comentariosRepository.crear =
                crearComentarioOriginal;

            solicitudesVisitaRepository.crear =
                crearSolicitudOriginal;

            reseniasRepository.crear =
                crearReseniaOriginal;

            actividadesRepository.crear =
                crearActividadOriginal;
        }
    }
);