import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { Vendedor } from "../entities/vendedor";
import { Inmobiliaria } from "../entities/inmobiliaria";
import { Propiedad } from "../entities/propiedad";

import {
  TipoPropiedad,
  Operacion,
  EstadoPropiedad,
} from "../entities/enums";

async function seed(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const vendedorRepository = AppDataSource.getRepository(Vendedor);
    const inmobiliariaRepository = AppDataSource.getRepository(Inmobiliaria);
    const propiedadRepository = AppDataSource.getRepository(Propiedad);

    // 1. VENDEDORES ---------------------------------------------------------

    const vendedor1 = vendedorRepository.create({
      nombreCompleto: "Juan Pérez",
      email: "juan@pinamarpropiedades.com",
      hashContrasena: "hash-demo-1234",
      telefono: "2254-111111",
    });

    const vendedor2 = vendedorRepository.create({
      nombreCompleto: "María Gómez",
      email: "maria@costainmuebles.com",
      hashContrasena: "hash-demo-5678",
      telefono: "2254-222222",
    });

    await vendedorRepository.save([vendedor1, vendedor2]);

    // 2. INMOBILIARIAS ---------------------------------------------------------------

    const inmobiliaria1 = inmobiliariaRepository.create({
      nombre: "Pinamar Propiedades",
      descripcion: "Inmobiliaria especializada en propiedades de Pinamar y la costa.",
      logoUrl: null,
      telefonoContacto: "2254-111111",
      emailContacto: "contacto@pinamarpropiedades.com",
      direccionOficina: "Av. Bunge 500, Pinamar",
      vendedor: vendedor1,
    });

    const inmobiliaria2 = inmobiliariaRepository.create({
      nombre: "Costa Inmuebles",
      descripcion: "Venta y alquiler de propiedades en la Costa Atlántica.",
      logoUrl: null,
      telefonoContacto: "2254-222222",
      emailContacto: "contacto@costainmuebles.com",
      direccionOficina: "Av. Espora 750, Valeria del Mar",
      vendedor: vendedor2,
    });

    await inmobiliariaRepository.save([
      inmobiliaria1,
      inmobiliaria2,
    ]);

    // 3. PROPIEDADES -----------------------------------------------------------------

    const propiedades = propiedadRepository.create([
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
        amenities: ["pileta", "cochera", "jardin"],
        estado: EstadoPropiedad.PUBLICADA,
        inmobiliaria: inmobiliaria1,
      },

      {
        titulo: "Departamento 2 ambientes céntrico",
        descripcion:
          "Departamento luminoso ubicado a pocas cuadras del centro de Pinamar.",
        tipo: TipoPropiedad.DEPARTAMENTO,
        operacion: Operacion.ALQUILER,
        precio: "650000",
        moneda: "ARS",
        direccion: "Jason 420",
        zona: "Pinamar",
        superficieCubiertaM2: "48",
        superficieTotalM2: "52",
        ambientes: 2,
        dormitorios: 1,
        banios: 1,
        antiguedadAnios: 5,
        amenities: ["balcon", "ascensor"],
        estado: EstadoPropiedad.PUBLICADA,
        inmobiliaria: inmobiliaria1,
      },

      {
        titulo: "Terreno en Ostende",
        descripcion:
          "Lote ubicado en zona residencial, ideal para proyecto de vivienda.",
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
        titulo: "Departamento frente al mar",
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
        amenities: ["vista al mar", "balcon", "cochera"],
        estado: EstadoPropiedad.PUBLICADA,
        inmobiliaria: inmobiliaria2,
      },

      {
        titulo: "Local comercial en zona céntrica",
        descripcion:
          "Local comercial con excelente ubicación y gran circulación peatonal.",
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
        estado: EstadoPropiedad.PUBLICADA,
        inmobiliaria: inmobiliaria2,
      },

      {
        titulo: "Casa familiar en Valeria del Mar",
        descripcion:
          "Casa cómoda con parque, parrilla y espacio para dos vehículos.",
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
        amenities: ["parrilla", "cochera", "jardin", "admite mascotas"],
        estado: EstadoPropiedad.RESERVADA,
        inmobiliaria: inmobiliaria2,
      },
    ]);

    await propiedadRepository.save(propiedades);

    console.log("Seed ejecutado correctamente.");
    console.log(`Vendedores creados: 2`);
    console.log(`Inmobiliarias creadas: 2`);
    console.log(`Propiedades creadas: ${propiedades.length}`);
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error("Error al ejecutar el seed:", error);
  process.exitCode = 1;
});
