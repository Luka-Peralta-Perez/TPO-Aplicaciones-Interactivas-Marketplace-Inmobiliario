import "reflect-metadata";
import bcrypt from "bcrypt";
import { AppDataSource } from "../config/data-source";

import { Vendedor } from "../entities/vendedor";
import { Inmobiliaria } from "../entities/inmobiliaria";
import { Propiedad } from "../entities/propiedad";
import { HistorialEstadoPropiedad } from "../entities/historial-estado-propiedad";
import { Comentario } from "../entities/comentario";
import { SolicitudVisita } from "../entities/solicitud-visita";
import { Resenia } from "../entities/resenia";
import { Actividad } from "../entities/actividad";

import {
  TipoPropiedad,
  Operacion,
  EstadoPropiedad,
  EstadoSolicitudVisita,
  TipoActividad,
} from "../entities/enums";

function fechaEnDias(dias: number, hora = 15): Date {
  const fecha = new Date();

  fecha.setDate(fecha.getDate() + dias);
  fecha.setHours(hora, 0, 0, 0);

  return fecha;
}

async function seed(): Promise<void> {
  await AppDataSource.initialize();

  try {
    await AppDataSource.transaction(async (manager) => {
      const vendedorRepository =
        manager.getRepository(Vendedor);

      const inmobiliariaRepository =
        manager.getRepository(Inmobiliaria);

      const propiedadRepository =
        manager.getRepository(Propiedad);

      const historialRepository =
        manager.getRepository(HistorialEstadoPropiedad);

      const comentarioRepository =
        manager.getRepository(Comentario);

      const solicitudRepository =
        manager.getRepository(SolicitudVisita);

      const reseniaRepository =
        manager.getRepository(Resenia);

      const actividadRepository =
        manager.getRepository(Actividad);

      // 1. VENDEDORES
      // Contraseña de prueba para ambos: Clave123!

      const hashContrasenia =
        await bcrypt.hash("Clave123!", 10);

      const vendedor1 = vendedorRepository.create({
        nombreCompleto: "Juan Pérez",
        email: "juan@pinamarpropiedades.com",
        hashContrasenia,
        telefono: "2254-111111",
      });

      const vendedor2 = vendedorRepository.create({
        nombreCompleto: "María Gómez",
        email: "maria@costainmuebles.com",
        hashContrasenia,
        telefono: "2254-222222",
      });

      await vendedorRepository.save([
        vendedor1,
        vendedor2,
      ]);

      // 2. INMOBILIARIAS

      const inmobiliaria1 =
        inmobiliariaRepository.create({
          nombre: "Pinamar Propiedades",
          descripcion:
            "Inmobiliaria especializada en propiedades de Pinamar y la costa.",
          logoUrl: null,
          telefonoContacto: "2254-111111",
          emailContacto:
            "contacto@pinamarpropiedades.com",
          direccionOficina:
            "Av. Bunge 500, Pinamar",
          vendedor: vendedor1,
        });

      const inmobiliaria2 =
        inmobiliariaRepository.create({
          nombre: "Costa Inmuebles",
          descripcion:
            "Venta y alquiler de propiedades en la Costa Atlántica.",
          logoUrl: null,
          telefonoContacto: "2254-222222",
          emailContacto:
            "contacto@costainmuebles.com",
          direccionOficina:
            "Av. Espora 750, Valeria del Mar",
          vendedor: vendedor2,
        });

      await inmobiliariaRepository.save([
        inmobiliaria1,
        inmobiliaria2,
      ]);

      // 3. PROPIEDADES
      // Juan tiene ejemplos en todos los estados.

      const propiedades =
        propiedadRepository.create([
          {
            titulo: "Casa con pileta en Pinamar",
            descripcion:
              "Casa amplia con jardín, pileta y cochera, ideal para vivienda permanente.",
            tipo: TipoPropiedad.CASA,
            operacion: Operacion.VENTA,
            precio: "180000",
            moneda: "USD",
            direccion: "De las Artes 850",
            zona: "Pinamar",
            superficieCubiertaM2: "180",
            superficieTotalM2: "450",
            ambientes: 5,
            dormitorios: 3,
            banios: 2,
            antiguedadAnios: 10,
            amenities: [
              "pileta",
              "cochera",
              "jardin",
            ],
            estado: EstadoPropiedad.PUBLICADA,
            inmobiliaria: inmobiliaria1,
          },

          {
            titulo: "Terreno en Ostende",
            descripcion:
              "Lote residencial listo para desarrollar.",
            tipo: TipoPropiedad.TERRENO,
            operacion: Operacion.VENTA,
            precio: "55000",
            moneda: "USD",
            direccion: "Corso Florida 1200",
            zona: "Ostende",
            superficieCubiertaM2: null,
            superficieTotalM2: "600",
            ambientes: null,
            dormitorios: null,
            banios: null,
            antiguedadAnios: null,
            amenities: [],
            estado: EstadoPropiedad.BORRADOR,
            inmobiliaria: inmobiliaria1,
          },

          {
            titulo: "Local comercial pausado",
            descripcion:
              "Local céntrico actualmente pausado por decisión del vendedor.",
            tipo: TipoPropiedad.LOCAL,
            operacion: Operacion.ALQUILER,
            precio: "900000",
            moneda: "ARS",
            direccion: "Av. Bunge 300",
            zona: "Pinamar",
            superficieCubiertaM2: "85",
            superficieTotalM2: "85",
            ambientes: 1,
            dormitorios: null,
            banios: 1,
            antiguedadAnios: 15,
            amenities: ["apto profesional"],
            estado: EstadoPropiedad.PAUSADA,
            inmobiliaria: inmobiliaria1,
          },

          {
            titulo:
              "Departamento reservado en Pinamar",
            descripcion:
              "Departamento luminoso de tres ambientes cerca del centro.",
            tipo: TipoPropiedad.DEPARTAMENTO,
            operacion: Operacion.VENTA,
            precio: "120000",
            moneda: "USD",
            direccion: "Jason 420",
            zona: "Pinamar",
            superficieCubiertaM2: "65",
            superficieTotalM2: "70",
            ambientes: 3,
            dormitorios: 2,
            banios: 1,
            antiguedadAnios: 6,
            amenities: [
              "balcon",
              "ascensor",
            ],
            estado: EstadoPropiedad.RESERVADA,
            inmobiliaria: inmobiliaria1,
          },

          {
            titulo: "Casa vendida en Ostende",
            descripcion:
              "Casa familiar ya vendida, incluida para probar estados finales.",
            tipo: TipoPropiedad.CASA,
            operacion: Operacion.VENTA,
            precio: "150000",
            moneda: "USD",
            direccion: "Saavedra 900",
            zona: "Ostende",
            superficieCubiertaM2: "150",
            superficieTotalM2: "350",
            ambientes: 4,
            dormitorios: 3,
            banios: 2,
            antiguedadAnios: 9,
            amenities: [
              "cochera",
              "jardin",
            ],
            estado: EstadoPropiedad.VENDIDA,
            inmobiliaria: inmobiliaria1,
          },

          {
            titulo:
              "Departamento alquilado en Pinamar",
            descripcion:
              "Departamento ya alquilado, incluido para probar estados finales.",
            tipo: TipoPropiedad.DEPARTAMENTO,
            operacion: Operacion.ALQUILER,
            precio: "700000",
            moneda: "ARS",
            direccion: "Constitución 350",
            zona: "Pinamar",
            superficieCubiertaM2: "50",
            superficieTotalM2: "55",
            ambientes: 2,
            dormitorios: 1,
            banios: 1,
            antiguedadAnios: 4,
            amenities: [
              "balcon",
              "ascensor",
            ],
            estado: EstadoPropiedad.ALQUILADA,
            inmobiliaria: inmobiliaria1,
          },

          {
            titulo:
              "Casa cancelada en Pinamar",
            descripcion:
              "Publicación cancelada incluida para probar un estado final.",
            tipo: TipoPropiedad.CASA,
            operacion: Operacion.VENTA,
            precio: "165000",
            moneda: "USD",
            direccion: "Del Tuyú 800",
            zona: "Pinamar",
            superficieCubiertaM2: "160",
            superficieTotalM2: "400",
            ambientes: 4,
            dormitorios: 3,
            banios: 2,
            antiguedadAnios: 8,
            amenities: [
              "jardin",
              "parrilla",
            ],
            estado: EstadoPropiedad.CANCELADA,
            inmobiliaria: inmobiliaria1,
          },

          // Propiedades de María.
          // Nos sirven también para probar los 403.

          {
            titulo:
              "Departamento frente al mar",
            descripcion:
              "Departamento con vista al mar, balcón amplio y cochera cubierta.",
            tipo: TipoPropiedad.DEPARTAMENTO,
            operacion: Operacion.VENTA,
            precio: "145000",
            moneda: "USD",
            direccion: "Av. Costanera 120",
            zona: "Valeria del Mar",
            superficieCubiertaM2: "70",
            superficieTotalM2: "78",
            ambientes: 3,
            dormitorios: 2,
            banios: 2,
            antiguedadAnios: 8,
            amenities: [
              "vista al mar",
              "balcon",
              "cochera",
            ],
            estado: EstadoPropiedad.PUBLICADA,
            inmobiliaria: inmobiliaria2,
          },

          {
            titulo:
              "Casa familiar en Valeria del Mar",
            descripcion:
              "Casa con parque, parrilla y espacio para dos vehículos.",
            tipo: TipoPropiedad.CASA,
            operacion: Operacion.VENTA,
            precio: "125000",
            moneda: "USD",
            direccion: "Azopardo 950",
            zona: "Valeria del Mar",
            superficieCubiertaM2: "140",
            superficieTotalM2: "380",
            ambientes: 4,
            dormitorios: 3,
            banios: 2,
            antiguedadAnios: 12,
            amenities: [
              "parrilla",
              "cochera",
              "jardin",
              "admite mascotas",
            ],
            estado: EstadoPropiedad.RESERVADA,
            inmobiliaria: inmobiliaria2,
          },
        ]);

      await propiedadRepository.save(
        propiedades
      );

      const [
        propiedadPublicada,
        propiedadBorrador,
        propiedadPausada,
        propiedadReservada,
        propiedadVendida,
        propiedadAlquilada,
        propiedadCancelada,
        propiedadPublicadaOtra,
        propiedadReservadaOtra,
      ] = propiedades;

      // 4. HISTORIAL DE ESTADOS
      // GET /properties/:id/status-history.

      const historiales =
        historialRepository.create([
          {
            propiedad: propiedadPublicada,
            estadoAnterior:
              EstadoPropiedad.BORRADOR,
            estadoNuevo:
              EstadoPropiedad.PUBLICADA,
            creadoEn: new Date(
              "2026-06-02T12:00:00.000Z"
            ),
          },

          {
            propiedad: propiedadPausada,
            estadoAnterior:
              EstadoPropiedad.BORRADOR,
            estadoNuevo:
              EstadoPropiedad.PUBLICADA,
            creadoEn: new Date(
              "2026-06-10T12:00:00.000Z"
            ),
          },
          {
            propiedad: propiedadPausada,
            estadoAnterior:
              EstadoPropiedad.PUBLICADA,
            estadoNuevo:
              EstadoPropiedad.PAUSADA,
            creadoEn: new Date(
              "2026-06-20T12:00:00.000Z"
            ),
          },

          {
            propiedad: propiedadReservada,
            estadoAnterior:
              EstadoPropiedad.BORRADOR,
            estadoNuevo:
              EstadoPropiedad.PUBLICADA,
            creadoEn: new Date(
              "2026-07-01T12:00:00.000Z"
            ),
          },
          {
            propiedad: propiedadReservada,
            estadoAnterior:
              EstadoPropiedad.PUBLICADA,
            estadoNuevo:
              EstadoPropiedad.RESERVADA,
            creadoEn: new Date(
              "2026-07-08T12:00:00.000Z"
            ),
          },

          {
            propiedad: propiedadVendida,
            estadoAnterior:
              EstadoPropiedad.BORRADOR,
            estadoNuevo:
              EstadoPropiedad.PUBLICADA,
            creadoEn: new Date(
              "2026-05-01T12:00:00.000Z"
            ),
          },
          {
            propiedad: propiedadVendida,
            estadoAnterior:
              EstadoPropiedad.PUBLICADA,
            estadoNuevo:
              EstadoPropiedad.RESERVADA,
            creadoEn: new Date(
              "2026-05-10T12:00:00.000Z"
            ),
          },
          {
            propiedad: propiedadVendida,
            estadoAnterior:
              EstadoPropiedad.RESERVADA,
            estadoNuevo:
              EstadoPropiedad.VENDIDA,
            creadoEn: new Date(
              "2026-05-18T12:00:00.000Z"
            ),
          },

          {
            propiedad: propiedadAlquilada,
            estadoAnterior:
              EstadoPropiedad.BORRADOR,
            estadoNuevo:
              EstadoPropiedad.PUBLICADA,
            creadoEn: new Date(
              "2026-05-15T12:00:00.000Z"
            ),
          },
          {
            propiedad: propiedadAlquilada,
            estadoAnterior:
              EstadoPropiedad.PUBLICADA,
            estadoNuevo:
              EstadoPropiedad.RESERVADA,
            creadoEn: new Date(
              "2026-05-20T12:00:00.000Z"
            ),
          },
          {
            propiedad: propiedadAlquilada,
            estadoAnterior:
              EstadoPropiedad.RESERVADA,
            estadoNuevo:
              EstadoPropiedad.ALQUILADA,
            creadoEn: new Date(
              "2026-05-28T12:00:00.000Z"
            ),
          },

          {
            propiedad: propiedadCancelada,
            estadoAnterior:
              EstadoPropiedad.BORRADOR,
            estadoNuevo:
              EstadoPropiedad.PUBLICADA,
            creadoEn: new Date(
              "2026-08-01T12:00:00.000Z"
            ),
          },
          {
            propiedad: propiedadCancelada,
            estadoAnterior:
              EstadoPropiedad.PUBLICADA,
            estadoNuevo:
              EstadoPropiedad.CANCELADA,
            creadoEn: new Date(
              "2026-08-12T12:00:00.000Z"
            ),
          },

          {
            propiedad:
              propiedadPublicadaOtra,
            estadoAnterior:
              EstadoPropiedad.BORRADOR,
            estadoNuevo:
              EstadoPropiedad.PUBLICADA,
            creadoEn: new Date(
              "2026-09-01T12:00:00.000Z"
            ),
          },

          {
            propiedad:
              propiedadReservadaOtra,
            estadoAnterior:
              EstadoPropiedad.BORRADOR,
            estadoNuevo:
              EstadoPropiedad.PUBLICADA,
            creadoEn: new Date(
              "2026-09-03T12:00:00.000Z"
            ),
          },
          {
            propiedad:
              propiedadReservadaOtra,
            estadoAnterior:
              EstadoPropiedad.PUBLICADA,
            estadoNuevo:
              EstadoPropiedad.RESERVADA,
            creadoEn: new Date(
              "2026-09-08T12:00:00.000Z"
            ),
          },
        ]);

      await historialRepository.save(
        historiales
      );

      // 5. COMENTARIOS

      const comentarios =
        comentarioRepository.create([
          {
            nombreAutor: "Lucía Fernández",
            contenido:
              "¿La propiedad acepta mascotas?",
            respuesta:
              "Sí, se aceptan mascotas.",
            propiedad: propiedadPublicada,
          },

          {
            nombreAutor: "Federico López",
            contenido:
              "¿Tiene calefacción?",
            propiedad: propiedadPublicada,
          },

          {
            nombreAutor: "Carolina Díaz",
            contenido:
              "¿Se puede coordinar una visita el fin de semana?",
            propiedad:
              propiedadPublicadaOtra,
          },

          {
            nombreAutor: "Mateo Silva",
            contenido:
              "¿Sigue disponible aunque figure vendida?",
            respuesta:
              "No, la operación ya fue concretada.",
            propiedad: propiedadVendida,
          },
        ]);

      await comentarioRepository.save(
        comentarios
      );

      // 6. SOLICITUDES DE VISITA

      const solicitudes =
        solicitudRepository.create([
          {
            nombreSolicitante:
              "Sofía Martínez",
            telefono: "2254-333333",
            fechaPropuesta: fechaEnDias(7),
            mensaje:
              "Quisiera conocer la propiedad.",
            estado:
              EstadoSolicitudVisita.PENDIENTE,
            propiedad: propiedadPublicada,
          },

          {
            nombreSolicitante:
              "Tomás Ruiz",
            telefono: "2254-444444",
            fechaPropuesta:
              fechaEnDias(10),
            mensaje:
              "Tengo disponibilidad por la tarde.",
            estado:
              EstadoSolicitudVisita.CONFIRMADA,
            propiedad: propiedadReservada,
          },

          {
            nombreSolicitante:
              "Paula García",
            telefono: "2254-555555",
            fechaPropuesta: new Date(
              "2026-05-12T15:00:00.000Z"
            ),
            mensaje:
              "Visita realizada antes de la venta.",
            estado:
              EstadoSolicitudVisita.REALIZADA,
            propiedad: propiedadVendida,
          },

          {
            nombreSolicitante:
              "Julieta Paz",
            telefono: "2254-666666",
            fechaPropuesta:
              fechaEnDias(14),
            mensaje:
              "Finalmente no podré asistir.",
            estado:
              EstadoSolicitudVisita.CANCELADA,
            propiedad: propiedadPublicada,
          },

          {
            nombreSolicitante:
              "Nicolás Romero",
            telefono: "2254-777777",
            fechaPropuesta:
              fechaEnDias(12),
            estado:
              EstadoSolicitudVisita.RECHAZADA,
            propiedad:
              propiedadPublicadaOtra,
          },
        ]);

      await solicitudRepository.save(
        solicitudes
      );

      // 7. RESEÑAS

      const resenias =
        reseniaRepository.create([
          {
            nombreAutor:
              "Martina Suárez",
            contenido:
              "Excelente atención y muy buena predisposición.",
            calificacion: 5,
            inmobiliaria: inmobiliaria1,
          },

          {
            nombreAutor:
              "Agustín Torres",
            contenido:
              "Respondieron rápido todas mis consultas.",
            calificacion: 4,
            inmobiliaria: inmobiliaria1,
          },

          {
            nombreAutor:
              "Camila Rossi",
            contenido:
              "Muy buena experiencia con la inmobiliaria.",
            calificacion: 5,
            inmobiliaria: inmobiliaria2,
          },
        ]);

      await reseniaRepository.save(
        resenias
      );

      // 8. ACTIVIDADES

      const actividades =
        actividadRepository.create([
          {
            tipo: TipoActividad.COMENTARIO,
            referenciaOrigen:
              comentarios[0].id,
            leida: false,
            inmobiliaria: inmobiliaria1,
          },

          {
            tipo: TipoActividad.COMENTARIO,
            referenciaOrigen:
              comentarios[1].id,
            leida: true,
            inmobiliaria: inmobiliaria1,
          },

          {
            tipo: TipoActividad.COMENTARIO,
            referenciaOrigen:
              comentarios[2].id,
            leida: false,
            inmobiliaria: inmobiliaria2,
          },

          {
            tipo: TipoActividad.COMENTARIO,
            referenciaOrigen:
              comentarios[3].id,
            leida: false,
            inmobiliaria: inmobiliaria1,
          },

          {
            tipo:
              TipoActividad.SOLICITUD_VISITA,
            referenciaOrigen:
              solicitudes[0].id,
            leida: false,
            inmobiliaria: inmobiliaria1,
          },

          {
            tipo:
              TipoActividad.SOLICITUD_VISITA,
            referenciaOrigen:
              solicitudes[1].id,
            leida: false,
            inmobiliaria: inmobiliaria1,
          },

          {
            tipo:
              TipoActividad.SOLICITUD_VISITA,
            referenciaOrigen:
              solicitudes[2].id,
            leida: true,
            inmobiliaria: inmobiliaria1,
          },

          {
            tipo:
              TipoActividad.SOLICITUD_VISITA,
            referenciaOrigen:
              solicitudes[3].id,
            leida: true,
            inmobiliaria: inmobiliaria1,
          },

          {
            tipo:
              TipoActividad.SOLICITUD_VISITA,
            referenciaOrigen:
              solicitudes[4].id,
            leida: false,
            inmobiliaria: inmobiliaria2,
          },

          {
            tipo: TipoActividad.RESENA,
            referenciaOrigen:
              resenias[0].id,
            leida: false,
            inmobiliaria: inmobiliaria1,
          },

          {
            tipo: TipoActividad.RESENA,
            referenciaOrigen:
              resenias[1].id,
            leida: true,
            inmobiliaria: inmobiliaria1,
          },

          {
            tipo: TipoActividad.RESENA,
            referenciaOrigen:
              resenias[2].id,
            leida: false,
            inmobiliaria: inmobiliaria2,
          },
        ]);

      await actividadRepository.save(
        actividades
      );

      console.log(
        "Seed ejecutado correctamente."
      );

      console.log("");
      console.log(
        "Credenciales de prueba:"
      );

      console.log(
        "Juan:  juan@pinamarpropiedades.com / Clave123!"
      );

      console.log(
        "María: maria@costainmuebles.com / Clave123!"
      );

      console.log("");

      console.log(
        `Vendedores: 2`
      );

      console.log(
        `Inmobiliarias: 2`
      );

      console.log(
        `Propiedades: ${propiedades.length}`
      );

      console.log(
        `Historiales: ${historiales.length}`
      );

      console.log(
        `Comentarios: ${comentarios.length}`
      );

      console.log(
        `Solicitudes de visita: ${solicitudes.length}`
      );

      console.log(
        `Reseñas: ${resenias.length}`
      );

      console.log(
        `Actividades: ${actividades.length}`
      );

      console.log("");

      console.log(
        `Inmobiliaria Juan: id ${inmobiliaria1.id}`
      );

      console.log(
        `Inmobiliaria María: id ${inmobiliaria2.id}`
      );

      console.log(
        `Propiedad pública de Juan: id ${propiedadPublicada.id}`
      );

      console.log(
        `Propiedad borrador de Juan: id ${propiedadBorrador.id}`
      );

      console.log(
        `Propiedad pública de María: id ${propiedadPublicadaOtra.id}`
      );
    });
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error(
    "Error al ejecutar el seed:",
    error
  );

  process.exitCode = 1;
});