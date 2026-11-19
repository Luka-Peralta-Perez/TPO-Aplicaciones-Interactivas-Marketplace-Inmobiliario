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

const FOTO_CASA_1 = "https://images.unsplash.com/photo-1771366260867-7e07094579d7?auto=format&fit=crop&w=1200&q=80";
const FOTO_CASA_2 = "https://images.unsplash.com/photo-1766603636562-531bb3e1dda8?auto=format&fit=crop&w=1200&q=80";
const FOTO_CASA_3 = "https://images.unsplash.com/photo-1748063578185-3d68121b11ff?auto=format&fit=crop&w=1200&q=80";

const FOTO_DEPTO_1 = "https://images.unsplash.com/photo-1560185009-5bf9f2849488?auto=format&fit=crop&w=1200&q=80";
const FOTO_DEPTO_2 = "https://images.unsplash.com/photo-1651407825566-c68c66de2cfd?auto=format&fit=crop&w=1200&q=80";
const FOTO_DEPTO_3 = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80";

const FOTO_TERRENO_1 = "https://images.unsplash.com/photo-1741665657440-90f58b4470ad?auto=format&fit=crop&w=1200&q=80";
const FOTO_TERRENO_2 = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";

const FOTO_LOCAL_1 = "https://images.unsplash.com/photo-1770385605649-11de1a033064?auto=format&fit=crop&w=1200&q=80";
const FOTO_LOCAL_2 = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80";

async function seed(): Promise<void> {
  await AppDataSource.initialize();

  try {
    await AppDataSource.transaction(async (manager) => {
      const vendedorRepository = manager.getRepository(Vendedor);
      const inmobiliariaRepository = manager.getRepository(Inmobiliaria);
      const propiedadRepository = manager.getRepository(Propiedad);
      const historialRepository = manager.getRepository(HistorialEstadoPropiedad);
      const comentarioRepository = manager.getRepository(Comentario);
      const solicitudRepository = manager.getRepository(SolicitudVisita);
      const reseniaRepository = manager.getRepository(Resenia);
      const actividadRepository = manager.getRepository(Actividad);

      // 1. VENDEDORES
      // Contraseña de prueba para ambos: Clave123!

      const hashContrasenia = await bcrypt.hash("Clave123!", 10);

      const vendedorJuan = vendedorRepository.create({
        nombreCompleto: "Juan Pérez",
        email: "juan@pinamarpropiedades.com",
        hashContrasenia,
        telefono: "2254-111111",
      });

      const vendedorMaria = vendedorRepository.create({
        nombreCompleto: "María Gómez",
        email: "maria@costainmuebles.com",
        hashContrasenia,
        telefono: "2254-222222",
      });

      await vendedorRepository.save([vendedorJuan, vendedorMaria]);

      // 2. INMOBILIARIAS

      const inmobiliariaJuan = inmobiliariaRepository.create({
        nombre: "Pinamar Propiedades",
        descripcion: "Inmobiliaria especializada en venta y alquiler de propiedades en Pinamar, Ostende y Valeria del Mar.",
        logoUrl: null,
        telefonoContacto: "2254-111111",
        emailContacto: "contacto@pinamarpropiedades.com",
        direccionOficina: "Av. Bunge 500, Pinamar",
        vendedor: vendedorJuan,
      });

      const inmobiliariaMaria = inmobiliariaRepository.create({
        nombre: "Costa Inmuebles",
        descripcion: "Inmobiliaria dedicada a propiedades residenciales en Cariló y Valeria del Mar.",
        logoUrl: null,
        telefonoContacto: "2254-222222",
        emailContacto: "contacto@costainmuebles.com",
        direccionOficina: "Av. Espora 750, Valeria del Mar",
        vendedor: vendedorMaria,
      });

      await inmobiliariaRepository.save([inmobiliariaJuan, inmobiliariaMaria]);

      // 3. PROPIEDADES
      // Juan es el usuario principal de demo.
      // Tiene casos en todos los estados y propiedades con/sin consultas y visitas.

      const propiedades = propiedadRepository.create([
        {
          titulo: "Casa moderna con pileta en Pinamar",
          descripcion: "Casa amplia y luminosa con jardín, pileta, parrilla y cochera. Ideal para vivienda permanente o vacaciones.",
          tipo: TipoPropiedad.CASA,
          operacion: Operacion.VENTA,
          precio: "245000",
          moneda: "USD",
          direccion: "De las Artes 850",
          zona: "Pinamar",
          superficieCubiertaM2: "190",
          superficieTotalM2: "480",
          ambientes: 5,
          dormitorios: 3,
          banios: 2,
          antiguedadAnios: 6,
          amenities: ["pileta", "cochera", "jardin", "parrilla"],
          fotos: [FOTO_CASA_1, FOTO_CASA_2, FOTO_DEPTO_1],
          fotoPortada: FOTO_CASA_1,
          estado: EstadoPropiedad.PUBLICADA,
          inmobiliaria: inmobiliariaJuan,
        },
        {
          titulo: "Departamento luminoso cerca del mar",
          descripcion: "Departamento de dos ambientes con balcón, excelente luz natural y ubicación a pocas cuadras de la playa.",
          tipo: TipoPropiedad.DEPARTAMENTO,
          operacion: Operacion.ALQUILER,
          precio: "780000",
          moneda: "ARS",
          direccion: "Constitución 420",
          zona: "Pinamar",
          superficieCubiertaM2: "48",
          superficieTotalM2: "54",
          ambientes: 2,
          dormitorios: 1,
          banios: 1,
          antiguedadAnios: 4,
          amenities: ["balcon", "ascensor", "admite mascotas"],
          fotos: [FOTO_DEPTO_1, FOTO_DEPTO_2, FOTO_DEPTO_3],
          fotoPortada: FOTO_DEPTO_1,
          estado: EstadoPropiedad.PUBLICADA,
          inmobiliaria: inmobiliariaJuan,
        },
        {
          titulo: "Terreno residencial en Ostende",
          descripcion: "Lote amplio en zona residencial tranquila, listo para desarrollar una vivienda unifamiliar.",
          tipo: TipoPropiedad.TERRENO,
          operacion: Operacion.VENTA,
          precio: "62000",
          moneda: "USD",
          direccion: "Corso Florida 1350",
          zona: "Ostende",
          superficieCubiertaM2: null,
          superficieTotalM2: "650",
          ambientes: null,
          dormitorios: null,
          banios: null,
          antiguedadAnios: null,
          amenities: [],
          fotos: [FOTO_TERRENO_1, FOTO_TERRENO_2],
          fotoPortada: FOTO_TERRENO_1,
          estado: EstadoPropiedad.BORRADOR,
          inmobiliaria: inmobiliariaJuan,
        },
        {
          titulo: "Local comercial sobre Av. Bunge",
          descripcion: "Local a la calle con gran vidriera, salón principal y baño. Actualmente pausado para mostrar el flujo de republicación.",
          tipo: TipoPropiedad.LOCAL,
          operacion: Operacion.ALQUILER,
          precio: "1250000",
          moneda: "ARS",
          direccion: "Av. Bunge 320",
          zona: "Pinamar",
          superficieCubiertaM2: "92",
          superficieTotalM2: "92",
          ambientes: 2,
          dormitorios: null,
          banios: 1,
          antiguedadAnios: 12,
          amenities: ["apto profesional"],
          fotos: [FOTO_LOCAL_1, FOTO_LOCAL_2],
          fotoPortada: FOTO_LOCAL_1,
          estado: EstadoPropiedad.PAUSADA,
          inmobiliaria: inmobiliariaJuan,
        },
        {
          titulo: "Departamento reservado con cochera",
          descripcion: "Departamento de tres ambientes con balcón y cochera, reservado para una operación de venta.",
          tipo: TipoPropiedad.DEPARTAMENTO,
          operacion: Operacion.VENTA,
          precio: "138000",
          moneda: "USD",
          direccion: "Jason 430",
          zona: "Pinamar",
          superficieCubiertaM2: "72",
          superficieTotalM2: "80",
          ambientes: 3,
          dormitorios: 2,
          banios: 2,
          antiguedadAnios: 7,
          amenities: ["balcon", "cochera", "ascensor"],
          fotos: [FOTO_DEPTO_2, FOTO_DEPTO_3, FOTO_DEPTO_1],
          fotoPortada: FOTO_DEPTO_2,
          estado: EstadoPropiedad.RESERVADA,
          inmobiliaria: inmobiliariaJuan,
        },
        {
          titulo: "Casa reservada para alquiler en Valeria",
          descripcion: "Casa cómoda con jardín y parrilla, actualmente reservada para una operación de alquiler.",
          tipo: TipoPropiedad.CASA,
          operacion: Operacion.ALQUILER,
          precio: "1100000",
          moneda: "ARS",
          direccion: "Azopardo 980",
          zona: "Valeria del Mar",
          superficieCubiertaM2: "135",
          superficieTotalM2: "360",
          ambientes: 4,
          dormitorios: 3,
          banios: 2,
          antiguedadAnios: 8,
          amenities: ["jardin", "parrilla", "cochera", "admite mascotas"],
          fotos: [FOTO_CASA_2, FOTO_CASA_3, FOTO_DEPTO_1],
          fotoPortada: FOTO_CASA_2,
          estado: EstadoPropiedad.RESERVADA,
          inmobiliaria: inmobiliariaJuan,
        },
        {
          titulo: "Casa vendida con jardín en Ostende",
          descripcion: "Casa familiar con jardín y cochera. La operación ya fue concretada y se conserva para mostrar historial y reportes.",
          tipo: TipoPropiedad.CASA,
          operacion: Operacion.VENTA,
          precio: "168000",
          moneda: "USD",
          direccion: "Saavedra 920",
          zona: "Ostende",
          superficieCubiertaM2: "155",
          superficieTotalM2: "390",
          ambientes: 4,
          dormitorios: 3,
          banios: 2,
          antiguedadAnios: 10,
          amenities: ["jardin", "cochera"],
          fotos: [FOTO_CASA_3, FOTO_CASA_1, FOTO_DEPTO_2],
          fotoPortada: FOTO_CASA_3,
          estado: EstadoPropiedad.VENDIDA,
          inmobiliaria: inmobiliariaJuan,
        },
        {
          titulo: "Departamento alquilado con balcón",
          descripcion: "Departamento de dos ambientes ya alquilado. Se utiliza para mostrar operaciones cerradas y métricas del dashboard.",
          tipo: TipoPropiedad.DEPARTAMENTO,
          operacion: Operacion.ALQUILER,
          precio: "690000",
          moneda: "ARS",
          direccion: "Del Tuyú 510",
          zona: "Pinamar",
          superficieCubiertaM2: "52",
          superficieTotalM2: "58",
          ambientes: 2,
          dormitorios: 1,
          banios: 1,
          antiguedadAnios: 5,
          amenities: ["balcon", "ascensor"],
          fotos: [FOTO_DEPTO_3, FOTO_DEPTO_2, FOTO_DEPTO_1],
          fotoPortada: FOTO_DEPTO_3,
          estado: EstadoPropiedad.ALQUILADA,
          inmobiliaria: inmobiliariaJuan,
        },
        {
          titulo: "Local comercial cancelado",
          descripcion: "Local comercial cuya publicación fue dada de baja. Se conserva para demostrar un estado final cancelado.",
          tipo: TipoPropiedad.LOCAL,
          operacion: Operacion.ALQUILER,
          precio: "980000",
          moneda: "ARS",
          direccion: "Av. Shaw 610",
          zona: "Pinamar",
          superficieCubiertaM2: "76",
          superficieTotalM2: "76",
          ambientes: 2,
          dormitorios: null,
          banios: 1,
          antiguedadAnios: 14,
          amenities: ["apto profesional"],
          fotos: [FOTO_LOCAL_2, FOTO_LOCAL_1],
          fotoPortada: FOTO_LOCAL_2,
          estado: EstadoPropiedad.CANCELADA,
          inmobiliaria: inmobiliariaJuan,
        },

        // Propiedades de María: sirven para demostrar separación entre vendedores.
        {
          titulo: "Departamento frente al mar en Cariló",
          descripcion: "Departamento moderno con vista abierta, balcón y cochera, publicado por Costa Inmuebles.",
          tipo: TipoPropiedad.DEPARTAMENTO,
          operacion: Operacion.VENTA,
          precio: "195000",
          moneda: "USD",
          direccion: "Av. Divisadero 250",
          zona: "Cariló",
          superficieCubiertaM2: "78",
          superficieTotalM2: "86",
          ambientes: 3,
          dormitorios: 2,
          banios: 2,
          antiguedadAnios: 5,
          amenities: ["balcon", "cochera", "ascensor", "vista al mar"],
          fotos: [FOTO_DEPTO_1, FOTO_DEPTO_2, FOTO_DEPTO_3],
          fotoPortada: FOTO_DEPTO_1,
          estado: EstadoPropiedad.PUBLICADA,
          inmobiliaria: inmobiliariaMaria,
        },
        {
          titulo: "Casa vendida en Valeria del Mar",
          descripcion: "Casa con parque y cochera cuya venta ya fue concretada por Costa Inmuebles.",
          tipo: TipoPropiedad.CASA,
          operacion: Operacion.VENTA,
          precio: "152000",
          moneda: "USD",
          direccion: "Espora 1020",
          zona: "Valeria del Mar",
          superficieCubiertaM2: "145",
          superficieTotalM2: "410",
          ambientes: 4,
          dormitorios: 3,
          banios: 2,
          antiguedadAnios: 11,
          amenities: ["jardin", "cochera", "parrilla"],
          fotos: [FOTO_CASA_1, FOTO_CASA_2, FOTO_CASA_3],
          fotoPortada: FOTO_CASA_1,
          estado: EstadoPropiedad.VENDIDA,
          inmobiliaria: inmobiliariaMaria,
        },
      ]);

      await propiedadRepository.save(propiedades);

      const [
        casaPublicada,
        departamentoPublicado,
        terrenoBorrador,
        localPausado,
        departamentoReservadoVenta,
        casaReservadaAlquiler,
        casaVendida,
        departamentoAlquilado,
        localCancelado,
        departamentoMaria,
        casaVendidaMaria,
      ] = propiedades;

      // 4. HISTORIAL DE ESTADOS
      // Fechas distribuidas en distintos meses para que Reportes tenga información útil.
      const historiales = historialRepository.create([
        { propiedad: casaPublicada, estadoAnterior: EstadoPropiedad.BORRADOR, estadoNuevo: EstadoPropiedad.PUBLICADA, creadoEn: new Date("2026-08-05T12:00:00.000Z") },
        { propiedad: departamentoPublicado, estadoAnterior: EstadoPropiedad.BORRADOR, estadoNuevo: EstadoPropiedad.PUBLICADA, creadoEn: new Date("2026-09-03T12:00:00.000Z") },

        { propiedad: localPausado, estadoAnterior: EstadoPropiedad.BORRADOR, estadoNuevo: EstadoPropiedad.PUBLICADA, creadoEn: new Date("2026-06-02T12:00:00.000Z") },
        { propiedad: localPausado, estadoAnterior: EstadoPropiedad.PUBLICADA, estadoNuevo: EstadoPropiedad.PAUSADA, creadoEn: new Date("2026-06-25T12:00:00.000Z") },

        { propiedad: departamentoReservadoVenta, estadoAnterior: EstadoPropiedad.BORRADOR, estadoNuevo: EstadoPropiedad.PUBLICADA, creadoEn: new Date("2026-07-01T12:00:00.000Z") },
        { propiedad: departamentoReservadoVenta, estadoAnterior: EstadoPropiedad.PUBLICADA, estadoNuevo: EstadoPropiedad.RESERVADA, creadoEn: new Date("2026-07-14T12:00:00.000Z") },

        { propiedad: casaReservadaAlquiler, estadoAnterior: EstadoPropiedad.BORRADOR, estadoNuevo: EstadoPropiedad.PUBLICADA, creadoEn: new Date("2026-09-10T12:00:00.000Z") },
        { propiedad: casaReservadaAlquiler, estadoAnterior: EstadoPropiedad.PUBLICADA, estadoNuevo: EstadoPropiedad.RESERVADA, creadoEn: new Date("2026-09-20T12:00:00.000Z") },

        { propiedad: casaVendida, estadoAnterior: EstadoPropiedad.BORRADOR, estadoNuevo: EstadoPropiedad.PUBLICADA, creadoEn: new Date("2026-05-01T12:00:00.000Z") },
        { propiedad: casaVendida, estadoAnterior: EstadoPropiedad.PUBLICADA, estadoNuevo: EstadoPropiedad.RESERVADA, creadoEn: new Date("2026-05-15T12:00:00.000Z") },
        { propiedad: casaVendida, estadoAnterior: EstadoPropiedad.RESERVADA, estadoNuevo: EstadoPropiedad.VENDIDA, creadoEn: new Date("2026-06-01T12:00:00.000Z") },

        { propiedad: departamentoAlquilado, estadoAnterior: EstadoPropiedad.BORRADOR, estadoNuevo: EstadoPropiedad.PUBLICADA, creadoEn: new Date("2026-06-10T12:00:00.000Z") },
        { propiedad: departamentoAlquilado, estadoAnterior: EstadoPropiedad.PUBLICADA, estadoNuevo: EstadoPropiedad.RESERVADA, creadoEn: new Date("2026-06-20T12:00:00.000Z") },
        { propiedad: departamentoAlquilado, estadoAnterior: EstadoPropiedad.RESERVADA, estadoNuevo: EstadoPropiedad.ALQUILADA, creadoEn: new Date("2026-07-05T12:00:00.000Z") },

        { propiedad: localCancelado, estadoAnterior: EstadoPropiedad.BORRADOR, estadoNuevo: EstadoPropiedad.PUBLICADA, creadoEn: new Date("2026-08-01T12:00:00.000Z") },
        { propiedad: localCancelado, estadoAnterior: EstadoPropiedad.PUBLICADA, estadoNuevo: EstadoPropiedad.CANCELADA, creadoEn: new Date("2026-08-18T12:00:00.000Z") },

        { propiedad: departamentoMaria, estadoAnterior: EstadoPropiedad.BORRADOR, estadoNuevo: EstadoPropiedad.PUBLICADA, creadoEn: new Date("2026-10-01T12:00:00.000Z") },
        { propiedad: casaVendidaMaria, estadoAnterior: EstadoPropiedad.BORRADOR, estadoNuevo: EstadoPropiedad.PUBLICADA, creadoEn: new Date("2026-04-05T12:00:00.000Z") },
        { propiedad: casaVendidaMaria, estadoAnterior: EstadoPropiedad.PUBLICADA, estadoNuevo: EstadoPropiedad.RESERVADA, creadoEn: new Date("2026-04-15T12:00:00.000Z") },
        { propiedad: casaVendidaMaria, estadoAnterior: EstadoPropiedad.RESERVADA, estadoNuevo: EstadoPropiedad.VENDIDA, creadoEn: new Date("2026-05-02T12:00:00.000Z") },
      ]);

      await historialRepository.save(historiales);

      // 5. COMENTARIOS
      // Hay propiedades sin consultas, con consultas respondidas y con consultas pendientes.

      const comentarios = comentarioRepository.create([
        {
          nombreAutor: "Lucía Fernández",
          contenido: "¿La casa acepta mascotas?",
          respuesta: "Sí, no hay problema con mascotas.",
          propiedad: casaPublicada,
        },
        {
          nombreAutor: "Federico López",
          contenido: "¿La pileta tiene mantenimiento incluido?",
          propiedad: casaPublicada,
        },
        {
          nombreAutor: "Camila Suárez",
          contenido: "¿El alquiler incluye gastos de jardinería?",
          propiedad: casaReservadaAlquiler,
        },
        {
          nombreAutor: "Mateo Silva",
          contenido: "¿La propiedad sigue disponible?",
          respuesta: "No, la venta ya fue concretada.",
          propiedad: casaVendida,
        },
        {
          nombreAutor: "Nicolás Romero",
          contenido: "¿La cochera está incluida en el precio?",
          respuesta: "Sí, la cochera está incluida.",
          propiedad: departamentoMaria,
        },
      ]);

      await comentarioRepository.save(comentarios);

      // 6. SOLICITUDES DE VISITA
      // Juan tiene ejemplos en todos los estados posibles.

      const solicitudes = solicitudRepository.create([
        {
          nombreSolicitante: "Sofía Martínez",
          telefono: "2254-333333",
          fechaPropuesta: fechaEnDias(7, 11),
          mensaje: "Quisiera conocer la casa durante la mañana.",
          estado: EstadoSolicitudVisita.PENDIENTE,
          propiedad: casaPublicada,
        },
        {
          nombreSolicitante: "Tomás Ruiz",
          telefono: "2254-444444",
          fechaPropuesta: fechaEnDias(10, 16),
          mensaje: "Tengo disponibilidad por la tarde.",
          estado: EstadoSolicitudVisita.CONFIRMADA,
          propiedad: departamentoReservadoVenta,
        },
        {
          nombreSolicitante: "Paula García",
          telefono: "2254-555555",
          fechaPropuesta: new Date("2026-05-20T15:00:00.000Z"),
          mensaje: "Visita realizada antes de concretar la venta.",
          estado: EstadoSolicitudVisita.REALIZADA,
          propiedad: casaVendida,
        },
        {
          nombreSolicitante: "Agustín Torres",
          telefono: "2254-666666",
          fechaPropuesta: new Date("2026-06-25T17:00:00.000Z"),
          mensaje: "Visita realizada antes de firmar el alquiler.",
          estado: EstadoSolicitudVisita.REALIZADA,
          propiedad: departamentoAlquilado,
        },
        {
          nombreSolicitante: "Martina Suárez",
          telefono: "2254-777777",
          fechaPropuesta: fechaEnDias(12, 10),
          mensaje: "Quería conocer el local antes de decidir.",
          estado: EstadoSolicitudVisita.RECHAZADA,
          propiedad: localCancelado,
        },
        {
          nombreSolicitante: "Julieta Paz",
          telefono: "2254-888888",
          fechaPropuesta: fechaEnDias(14, 15),
          mensaje: "Finalmente no podré asistir.",
          estado: EstadoSolicitudVisita.CANCELADA,
          propiedad: casaPublicada,
        },
        {
          nombreSolicitante: "Bruno Acosta",
          telefono: "2254-999999",
          fechaPropuesta: fechaEnDias(9, 12),
          mensaje: "Me interesa conocer la casa antes de avanzar con el alquiler.",
          estado: EstadoSolicitudVisita.PENDIENTE,
          propiedad: casaReservadaAlquiler,
        },
        {
          nombreSolicitante: "Valentina Costa",
          telefono: "2254-121212",
          fechaPropuesta: fechaEnDias(8, 14),
          mensaje: "¿Podemos coordinar una visita por la tarde?",
          estado: EstadoSolicitudVisita.PENDIENTE,
          propiedad: departamentoMaria,
        },
      ]);

      await solicitudRepository.save(solicitudes);

      // 7. RESEÑAS

      const resenias = reseniaRepository.create([
        {
          nombreAutor: "Martina Suárez",
          contenido: "Excelente atención y muy buena predisposición durante todo el proceso.",
          calificacion: 5,
          inmobiliaria: inmobiliariaJuan,
        },
        {
          nombreAutor: "Agustín Torres",
          contenido: "Respondieron rápido mis consultas y fueron claros con la información.",
          calificacion: 4,
          inmobiliaria: inmobiliariaJuan,
        },
        {
          nombreAutor: "Carolina Díaz",
          contenido: "Buena experiencia general y trato muy cordial.",
          calificacion: 4,
          inmobiliaria: inmobiliariaJuan,
        },
        {
          nombreAutor: "Camila Rossi",
          contenido: "Muy buena atención y seguimiento de la operación.",
          calificacion: 5,
          inmobiliaria: inmobiliariaMaria,
        },
      ]);

      await reseniaRepository.save(resenias);

      // 8. ACTIVIDADES
      // Algunas quedan sin leer para mostrar el contador de novedades.

      const actividades = actividadRepository.create([
        { tipo: TipoActividad.COMENTARIO, referenciaOrigen: comentarios[0].id, leida: true, inmobiliaria: inmobiliariaJuan },
        { tipo: TipoActividad.COMENTARIO, referenciaOrigen: comentarios[1].id, leida: false, inmobiliaria: inmobiliariaJuan },
        { tipo: TipoActividad.COMENTARIO, referenciaOrigen: comentarios[2].id, leida: false, inmobiliaria: inmobiliariaJuan },
        { tipo: TipoActividad.COMENTARIO, referenciaOrigen: comentarios[3].id, leida: true, inmobiliaria: inmobiliariaJuan },

        { tipo: TipoActividad.SOLICITUD_VISITA, referenciaOrigen: solicitudes[0].id, leida: false, inmobiliaria: inmobiliariaJuan },
        { tipo: TipoActividad.SOLICITUD_VISITA, referenciaOrigen: solicitudes[1].id, leida: true, inmobiliaria: inmobiliariaJuan },
        { tipo: TipoActividad.SOLICITUD_VISITA, referenciaOrigen: solicitudes[2].id, leida: true, inmobiliaria: inmobiliariaJuan },
        { tipo: TipoActividad.SOLICITUD_VISITA, referenciaOrigen: solicitudes[4].id, leida: false, inmobiliaria: inmobiliariaJuan },
        { tipo: TipoActividad.SOLICITUD_VISITA, referenciaOrigen: solicitudes[6].id, leida: false, inmobiliaria: inmobiliariaJuan },

        { tipo: TipoActividad.RESENA, referenciaOrigen: resenias[0].id, leida: false, inmobiliaria: inmobiliariaJuan },
        { tipo: TipoActividad.RESENA, referenciaOrigen: resenias[1].id, leida: true, inmobiliaria: inmobiliariaJuan },
        { tipo: TipoActividad.RESENA, referenciaOrigen: resenias[2].id, leida: false, inmobiliaria: inmobiliariaJuan },

        { tipo: TipoActividad.COMENTARIO, referenciaOrigen: comentarios[4].id, leida: false, inmobiliaria: inmobiliariaMaria },
        { tipo: TipoActividad.SOLICITUD_VISITA, referenciaOrigen: solicitudes[7].id, leida: false, inmobiliaria: inmobiliariaMaria },
        { tipo: TipoActividad.RESENA, referenciaOrigen: resenias[3].id, leida: false, inmobiliaria: inmobiliariaMaria },
      ]);

      await actividadRepository.save(actividades);

      console.log("Seed de demo ejecutado correctamente.");
      console.log("");
      console.log("Credenciales de prueba:");
      console.log("Juan:  juan@pinamarpropiedades.com / Clave123!");
      console.log("María: maria@costainmuebles.com / Clave123!");
      console.log("");
      console.log(`Vendedores: 2`);
      console.log(`Inmobiliarias: 2`);
      console.log(`Propiedades: ${propiedades.length}`);
      console.log(`Historiales: ${historiales.length}`);
      console.log(`Comentarios: ${comentarios.length}`);
      console.log(`Solicitudes de visita: ${solicitudes.length}`);
      console.log(`Reseñas: ${resenias.length}`);
      console.log(`Actividades: ${actividades.length}`);
      console.log("");
      console.log(`Inmobiliaria Juan: id ${inmobiliariaJuan.id}`);
      console.log(`Inmobiliaria María: id ${inmobiliariaMaria.id}`);
      console.log(`Casa publicada principal de Juan: id ${casaPublicada.id}`);
      console.log(`Departamento publicado sin consultas/visitas: id ${departamentoPublicado.id}`);
      console.log(`Terreno borrador de Juan: id ${terrenoBorrador.id}`);
    });
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error("Error al ejecutar el seed:", error);
  process.exitCode = 1;
});